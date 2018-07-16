// flow-typed signature: befbb482a5f7072d3a6848e960ac8481
// flow-typed version: <<STUB>>/@babel/parser_v7.0.0-beta.51/flow_v0.75.0

/**
 * This is an autogenerated libdef stub for:
 *
 *   '@babel/parser'
 *
 * Fill this stub out by replacing all the `any` types.
 *
 * Once filled out, we encourage you to share your work with the
 * community by sending a pull request to:
 * https://github.com/flowtype/flow-typed
 */

type ASTNode = {
  type: string,
  start: number,
  end: number,
  children: Array<ASTNode>,
};

type BabelParserOptions = {
  sourceType: "module",
  plugins: $ReadOnlyArray<string>,
};

declare module "@babel/parser" {
  declare module.exports: {
    parse: (code: string, options: BabelParserOptions) => ASTNode,
  };
}
