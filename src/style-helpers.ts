import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";

export function NWRuntimeParser(value: string) {
  if (value === "styleSheet(hairlineWidth)") {
    return StyleSheet.hairlineWidth;
  } else if (value.startsWith("roundToNearestPixel(")) {
    return parseFloat(value, PixelRatio.roundToNearestPixel);
  } else if (value.startsWith("getPixelSizeForLayoutSize(")) {
    return parseFloat(value, PixelRatio.getPixelSizeForLayoutSize);
  } else if (value.startsWith("getFontSizeForLayoutSize(")) {
    return parseFloat(value, getFontSizeForLayoutSize);
  } else if (value.startsWith("roundToNearestFontScale(")) {
    return parseFloat(value, roundToNearestFontScale);
  } else if (value.startsWith("platformColor(")) {
    return parseString(value, PlatformColor);
  } else if (value.startsWith("platform(")) {
    return parseString(value, platform);
  }

  return value;
}

function parseString(input: string, callback: (value: string) => unknown) {
  const result = input.match(/.+?\((.+)\)/);
  if (!result) return;
  return callback(result[1]);
}

function parseFloat(input: string, callback: (value: number) => unknown) {
  const result = input.match(/.+?\((.+)\)/);
  if (!result) return;

  const value = Number.parseFloat(result[1]);

  if (Number.isNaN(value)) return;

  return callback(value);
}

export function getFontSizeForLayoutSize(layoutSize: number) {
  return Math.round(layoutSize * PixelRatio.getFontScale());
}

export function roundToNearestFontScale(layoutSize: number) {
  const ratio = PixelRatio.getFontScale();
  return Math.round(layoutSize * ratio) / ratio;
}

function platform(platformValues: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const specifics: any = Object.fromEntries(
    platformValues
      .trim()
      .split(/\s+/)
      .map((platformValue) => {
        // Edge case:
        //   platform(android:platformColor(@android:color/holo_blue_bright))
        // Sometimes the value can has a colon, so we need to collect all values
        // and join them
        let [platform, ...tokens] = platformValue.split(":");

        if (!tokens) {
          tokens = [platform];
          platform = "default";
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any = tokens.join("");
        const numberValue = Number.parseFloat(value);

        value = Number.isFinite(numberValue)
          ? numberValue
          : NWRuntimeParser(value);

        return [platform, value];
      })
  );

  return Platform.select(specifics);
}
