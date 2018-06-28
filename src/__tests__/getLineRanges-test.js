// @flow

import getLineRanges from "../getLineRanges";

describe("getLineRanges", () => {
  it("returns an empty list when given no lines", () => {
    expect(getLineRanges([])).toEqual([]);
  });

  it("gets a single line range", () => {
    expect(getLineRanges(["hello"])).toEqual([[0, 5]]);
  });

  it("handles empty strings", () => {
    expect(getLineRanges([""])).toEqual([[0, 0]]);
    expect(getLineRanges(["", ""])).toEqual([[0, 0], [1, 1]]);
  });

  it("gets ranges for multiple lines", () => {
    expect(getLineRanges(["one", "two", "three"])).toEqual([
      [0, 3],
      [4, 7],
      [8, 13],
    ]);
  });

  it("indexes into the joined lines", () => {
    const lines = ["one", "two", "three"];
    const lineRanges = getLineRanges(lines);
    const joinedLines = lines.join("\n");
    lines.forEach((line, i) => {
      const [start, end] = lineRanges[i];
      expect(line).toEqual(joinedLines.slice(start, end));
    });
  });
});
