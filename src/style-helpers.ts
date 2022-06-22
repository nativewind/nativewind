import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function NWRuntimeParser(value: string): any {
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
    return parse(value, platformColor);
  } else if (value.startsWith("platform(")) {
    return parse(value, platform);
  }

  return value;
}

function parse<T extends (value: string) => S, S>(input: string, callback: T) {
  const result = input.match(/.+?\((.+)\)/);
  if (!result) return;
  const recursiveValue = NWRuntimeParser(result[1]);
  if (recursiveValue === undefined) return;
  return callback(recursiveValue);
}

function parseFloat<T extends (value: number) => S, S>(
  input: string,
  callback: T
) {
  const result = parse(input, (v) => v);
  if (!result) return;
  const value = typeof result === "string" ? Number.parseFloat(result) : result;

  if (Number.isNaN(value)) return;

  return callback(value as number);
}

export function getFontSizeForLayoutSize(layoutSize: number) {
  return Math.round(layoutSize * PixelRatio.getFontScale());
}

export function roundToNearestFontScale(layoutSize: number) {
  const ratio = PixelRatio.getFontScale();
  return Math.round(layoutSize * ratio) / ratio;
}

function platformColor(color: string) {
  // RWN does not implement PlatformColor
  // https://github.com/necolas/react-native-web/issues/2128
  return PlatformColor ? PlatformColor(color) : color;
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
