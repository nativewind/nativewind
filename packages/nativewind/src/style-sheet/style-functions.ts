import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";
import {
  isRuntimeFunction,
  matchRuntimeFunction,
} from "./style-function-helpers";

export function parseStyleFunction(
  functionString?: string,
  value?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  if (!functionString) {
    return;
  }

  if (value === undefined) {
    return;
  }

  switch (functionString) {
    case "hairlineWidth":
      return StyleSheet.hairlineWidth;
    case "round":
      return parseFloat(value, Math.round);
    case "roundToNearestPixel":
      return parseFloat(value, PixelRatio.roundToNearestPixel);
    case "getPixelSizeForLayoutSize":
      return parseFloat(value, PixelRatio.roundToNearestPixel);
    case "getFontSizeForLayoutSize":
      return parseFloat(value, getFontSizeForLayoutSize);
    case "roundToNearestFontScale":
      return roundToNearestFontScale;
    case "platformColor":
      return parseString(value, platformColor);
    case "platform":
      return parseString(value, platform);
  }

  throw new Error(`Unknown functionString: ${functionString}`);
}

export function parseString<T extends (value: string) => S, S>(
  input: string,
  callback: T
) {
  return callback(
    isRuntimeFunction(input)
      ? parseStyleFunction(...matchRuntimeFunction(input))
      : input
  );
}

function parseFloat<T extends (value: number) => S, S>(
  input: string,
  callback: T
) {
  const value = Number.parseFloat(
    isRuntimeFunction(input)
      ? parseStyleFunction(...matchRuntimeFunction(input))
      : input
  );

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
          : parseStyleFunction(value);

        return [platform, value];
      })
  );

  return Platform.select(specifics);
}
