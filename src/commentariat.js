// @flow

import DefaultMap from "./DefaultMap";
import findEnclosingNode from "./astTools";
import getLineRanges from "./getLineRanges";
import {flatMap} from "./utils";

let babelParser;

type CommentType = "line" | "block";
type CommentDesc = {
  comment: string,
  line: number,
  type: CommentType,
};

const LEADING_SPACE_REGEX = /^(\s*).*$/;
function leadingWhitespace(line: string): string {
  const match = line.match(LEADING_SPACE_REGEX);
  if (match == null) {
    throw new Error("Couldn't match leading whitespace");
  }
  return match[1];
}

type CommentInfo = {
  comment: string,
  type: CommentType,
  jsx: boolean,
};

// TODO(zgotsch): This logic got kind of hairy
function writeComment(
  {type, comment, jsx}: CommentInfo,
  indent: string
): Array<string> {
  if (type === "line") {
    if (jsx) {
      return comment.split("\n").map(line => `${indent}{/* ${line} */}`);
    }
    return comment.split("\n").map(line => `${indent}// ${line}`);
  }

  const commentLines = comment.split("\n");
  if (commentLines.length === 1) {
    if (jsx) {
      return [`${indent}{/* ${comment} */}`];
    }
    return [`${indent}/* ${comment} */`];
  }

  const [first, ...rest] = commentLines;
  if (jsx) {
    return [
      `${indent}{/* ${first}`,
      ...rest.map(line => ` ${indent} * ${line}`),
      ` ${indent} */}`,
    ];
  }
  return [
    `${indent}/* ${first}`,
    ...rest.map(line => `${indent} * ${line}`),
    `${indent} */`,
  ];
}
function addComments(
  line: string,
  commentInfos: $ReadOnlyArray<CommentInfo>
): Array<string> {
  const indent = leadingWhitespace(line);
  const commentLines = flatMap(
    commentInfo => writeComment(commentInfo, indent),
    commentInfos
  );
  return commentLines.concat([line]);
}

type CommentSourceOptions = {
  jsx: boolean,
};

/* Insert comments into source.
 * If multiple comments correspond to the same line, they will be inserted
 * in the order they are specified.
 */
export default function commentSource(
  source: string,
  comments: $ReadOnlyArray<CommentDesc>,
  {jsx}: CommentSourceOptions = {jsx: false}
): string {
  let parseTree;
  let babelTraverse;

  if (jsx) {
    if (babelParser == null || babelTraverse == null) {
      try {
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        babelParser = require("@babel/parser");
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        babelTraverse = require("@babel/traverse").default;
      } catch (e) {
        throw new Error(
          "Install the optional dependencies '@babel/parser' and '@babel/traverse' to use JSX functionality"
        );
      }

      parseTree = babelParser.parse(source, {
        sourceType: "module",
        plugins: ["jsx", "flow"],
      });
    }
  }

  // Massage comments into a lookup by line number
  const commentsByLineNumber: DefaultMap<
    number,
    $ReadOnlyArray<CommentDesc>
  > = comments.reduce(
    (memo, commentDesc) =>
      memo.update(
        commentDesc.line,
        (commentsForLine: $ReadOnlyArray<CommentDesc>) =>
          commentsForLine.concat([commentDesc])
      ),
    new DefaultMap(() => [])
  );

  const sourceLines = source.split("\n");

  let needsJSXByLines;
  if (parseTree != null) {
    const sourceLineRanges = getLineRanges(sourceLines);
    const enclosingNodes = sourceLineRanges.map(range => {
      const lastNewlineRange = [range[0] - 1, range[0]];
      // $FlowFixMe(zach): gonna fight this battle another day
      return findEnclosingNode(babelTraverse, parseTree, lastNewlineRange);
    });
    needsJSXByLines = enclosingNodes.map(
      node =>
        node != null &&
        node.type !== "JSXAttribute" &&
        node.type !== "JSXExpressionContainer" &&
        node.type.indexOf("JSX") !== -1
    );
  } else {
    needsJSXByLines = new Array(sourceLines.length);
    needsJSXByLines.fill(false);
  }

  // Adding comment lines is simply a flatMap
  const newSourceLines = flatMap((line, i) => {
    const lineNumber = i + 1;
    const commentInfos = commentsByLineNumber
      .get(lineNumber)
      .map(({comment, type}) => ({comment, type, jsx: needsJSXByLines[i]}));
    return addComments(line, commentInfos);
  }, source.split("\n"));
  return newSourceLines.join("\n");
}
