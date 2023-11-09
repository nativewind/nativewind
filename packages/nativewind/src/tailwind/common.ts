const denyColors = new Set([
  "lightBlue",
  "warmGray",
  "trueGray",
  "coolGray",
  "blueGray",
]);
export const allowedColors = ({ colors }: any) => {
  const _colors: Record<string, unknown> = {};
  for (const color of Object.keys(colors)) {
    if (denyColors.has(color)) {
      continue;
    }
    _colors[color] = colors[color];
  }
  return _colors;
};
