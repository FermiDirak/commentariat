// @flow

export default function getLineRanges(
  lines: $ReadOnlyArray<string>
): Array<[number, number]> {
  let current = 0;
  const ranges = [];

  lines.forEach(line => {
    const end = current + line.length;
    ranges.push([current, end]);
    // newline is the extra 1 char
    current = end + 1;
  });

  return ranges;
}
