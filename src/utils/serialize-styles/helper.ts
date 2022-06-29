import { StyleRecord } from "../../types/common";

export function serializeHelper(
  styleRecord: StyleRecord,
  replacer: (key: string, value: string) => [string, unknown]
) {
  let hasRuntimeFunction = false;

  const styles = Object.fromEntries(
    Object.entries(styleRecord).map(([key, style]) => {
      const transformedStyle = Object.fromEntries(
        Object.entries(style).map(([k, v]) => {
          if (typeof v === "string") {
            hasRuntimeFunction ||= isRuntimeFunction(v);
          }
          return replacer(k, v);
        })
      );

      return [key, transformedStyle];
    })
  );

  return {
    styles,
    hasRuntimeFunction,
  };
}

export function isRuntimeFunction(input: string) {
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
