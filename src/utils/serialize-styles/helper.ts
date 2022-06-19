import { StyleRecord } from "../../types/common";

export function serializeHelper(
  styleRecord: StyleRecord,
  replacer: (key: string, value: string) => [string, unknown]
) {
  let hasPlatform = false;
  let hasPlatformColor = false;
  let hasRoundToNearestPixel = false;

  const styles = Object.fromEntries(
    Object.entries(styleRecord).map(([key, style]) => {
      const transformedStyle = Object.fromEntries(
        Object.entries(style).map(([k, v]) => {
          if (typeof v === "string") {
            hasPlatform ||= v.includes("platform(");
            hasPlatformColor ||= v.includes("platformColor(");
            hasRoundToNearestPixel ||= v.includes("roundToNearestPixel(");
          }
          return replacer(k, v);
        })
      );

      return [key, transformedStyle];
    })
  );

  return {
    styles,
    hasPlatform,
    hasPlatformColor,
    hasRoundToNearestPixel,
  };
}
