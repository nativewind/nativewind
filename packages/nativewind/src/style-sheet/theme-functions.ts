import { StyleSheet, Platform, PlatformColor, PixelRatio } from "react-native";

export default {
  platformSelect: Platform.select,
  platformColor: (color: string) => {
    // RWN does not implement PlatformColor https://github.com/necolas/react-native-web/issues/2128
    return PlatformColor ? PlatformColor(color) : color;
  },
  hairlineWidth() {
    return StyleSheet.hairlineWidth;
  },
  pixelRatio: (value: number | Record<string, number>) => {
    const ratio = PixelRatio.get();
    return typeof value === "number" ? ratio * value : value[ratio] ?? ratio;
  },
  fontScale: (value: number | Record<string, number>) => {
    const scale = PixelRatio.getFontScale();
    return typeof value === "number" ? scale * value : value[scale] ?? scale;
  },
  getPixelSizeForLayoutSize: PixelRatio.getPixelSizeForLayoutSize,
  roundToNearestPixel: PixelRatio.getPixelSizeForLayoutSize,
};
