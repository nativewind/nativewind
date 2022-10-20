import type { PlatformOSType } from "react-native";

const fontScaleValue = 1;
const pixelScaleValue = 1;

export function hairlineWidth() {
  return 1;
}

export function platformSelect(
  specifics: Partial<Record<PlatformOSType | "default", string | number>>
) {
  return specifics["web"] ?? specifics["default"];
}

export function platformColor(colors: string[]) {
  return colors[colors.length - 1];
}

export function pixelRatio(value?: number) {
  if (!value) return pixelScaleValue;
  return value * pixelScaleValue;
}

export function pixelRatioSelect(specifics: Record<string, number | string>) {
  return specifics["web"] ?? specifics["default"];
}

export function fontScale(value?: number) {
  if (!value) return fontScaleValue;
  return `calc(${value} * ${fontScaleValue})`;
}

export function fontScaleSelect(specifics: Record<string, number>) {
  return specifics["web"] ?? specifics["default"];
}

export function getPixelSizeForLayoutSize(value: number) {
  return `calc(${value} * ${pixelScaleValue})`;
}

export function roundToNearestPixel(n: number) {
  return n;
}
