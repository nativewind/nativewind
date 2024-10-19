import type { PlatformOSType } from "react-native";

export function hairlineWidth() {
  return 1;
}

export function platformSelect(
  specifics: Partial<Record<PlatformOSType | "default", unknown>>,
) {
  return specifics["web"] ?? specifics["default"];
}

export function pixelScaleSelect(
  specifics: Partial<Record<number | "default", unknown>>,
) {
  return specifics[1] ?? specifics["default"];
}

export function fontScaleSelect(
  specifics: Partial<Record<number | "default", unknown>>,
) {
  return specifics[1] ?? specifics["default"];
}

export function pixelScale(value = 1) {
  return value;
}

export function fontScale(value = 1) {
  return value;
}

export function getPixelSizeForLayoutSize(value: number) {
  return value;
}

export function roundToNearestPixel(value: number) {
  return value;
}

export function platformColor(...colors: string[]) {
  return colors;
}
