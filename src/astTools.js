// @flow

export default function findEnclosingParentNode(
  traverse: (mixed, {}) => void,
  ast: mixed,
  range: [number, number]
): {type: string} | void {
  let lastContaining;
  traverse(ast, {
    enter(path) {
      const {start, end} = path.node;
      if (start <= range[0] && end >= range[1]) {
        lastContaining = path.node;
      } else {
        path.skip();
      }
    },
  });
  return lastContaining;
}
