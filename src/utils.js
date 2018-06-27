// TEAM: frontend_infra
// WATCHERS: zgotsch
// @flow

export function invariant(inv: mixed, message: string) {
  if (!inv) {
    throw new Error(message);
  }
}

// haskell style args
export function flatMap<T, S>(
  f: (T, number, $ReadOnlyArray<T>) => Array<S>,
  arr: $ReadOnlyArray<T>
): Array<S> {
  const output = [];
  arr.forEach((x, i, xs) => {
    output.push(...f(x, i, xs));
  });
  return output;
}
