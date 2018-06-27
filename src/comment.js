// TEAM: frontend_infra
// WATCHERS: zgotsch
// @flow

import DefaultMap from "./DefaultMap";
import {flatMap} from "./utils";

type CommentDesc = {
  comment: string,
  line: number,
  type: "line" | "block",
};

const LEADING_SPACE_REGEX = /^(\s*).*$/;
function leadingWhitespace(line: string): string {
  const match = line.match(LEADING_SPACE_REGEX);
  if (match == null) {
    throw new Error("Couldn't match leading whitespace");
  }
  return match[1];
}

function writeComment(
  {type, comment}: CommentDesc,
  indent: string
): Array<string> {
  if (type === "line") {
    return comment.split("\n").map(line => `${indent}// ${line}`);
  }
  const commentLines = comment.split("\n");
  if (commentLines.length === 1) {
    return [`${indent}/* ${comment} */`];
  }
  const [first, ...rest] = comment.split("\n");
  return [
    `${indent}/* ${first}`,
    ...rest.map(line => `${indent} * ${line}`),
    `${indent} */`,
  ];
}
function addComments(
  line: string,
  commentDescs: $ReadOnlyArray<CommentDesc>
): Array<string> {
  const indent = leadingWhitespace(line);
  const commentLines = flatMap(
    commentDesc => writeComment(commentDesc, indent),
    commentDescs
  );
  return commentLines.concat([line]);
}

/* Insert comments into source.
 * If multiple comments correspond to the same line, they will be inserted
 * in the order they are specified.
 */
export function commentSource(
  source: string,
  comments: $ReadOnlyArray<CommentDesc>
): string {
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

  // Adding comment lines is simply a flatMap
  const newSourceLines = flatMap((line, i) => {
    const lineNumber = i + 1;
    return addComments(line, commentsByLineNumber.get(lineNumber));
  }, source.split("\n"));
  return newSourceLines.join("\n");
}

export function f() {}
