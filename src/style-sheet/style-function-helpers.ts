/**
 * These need to be in a separate file as they are also used by Babel
 *
 * The main file imports 'react-native' which needs to be compiled
 */
export function isRuntimeFunction(input: string | number) {
  if (typeof input !== "string") return false;

  return (
    input === "hairlineWidth()" ||
    input.startsWith("roundToNearestPixel(") ||
    input.startsWith("getPixelSizeForLayoutSize(") ||
    input.startsWith("getFontSizeForLayoutSize(") ||
    input.startsWith("roundToNearestFontScale(") ||
    input.startsWith("platformColor(") ||
    input.startsWith("platform(")
  );
}

export function matchRuntimeFunction(
  input: string
): [string, string] | [undefined, undefined] {
  const matches = input.match(/(.+?)\((.*)\)/);
  if (!matches) return [undefined, undefined];
  return [matches[1], matches[2]];
}
