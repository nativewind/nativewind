import type { PlatformOSType } from "react-native";

function specificsToString(specifics: Record<string, unknown>) {
  return Object.entries(specifics)
    .map(([key, value]) => `${key}:${value}`)
    .join(", ");
}

export function hairlineWidth() {
  return `hairlineWidth()`;
}

export const platformSelect = (
  specifics: Partial<Record<PlatformOSType | "default", string | number>>
) => {
  return `platformSelect(${specificsToString(specifics)})`;
};

export function pixelRatio(value?: number) {
  return `pixelRatio(${value})`;
}

export function pixelRatioSelect(specifics: Record<string, number | string>) {
  return `fontScaleSelect(${specificsToString(specifics)})`;
}

export function platformColor(colors: string[]) {
  return `platformColor(${colors.join(", ")})`;
}

export function fontScale(value?: number) {
  return `fontScale(${value ?? ""})`;
}

export function fontScaleSelect(specifics: Record<string, number>) {
  return `fontScaleSelect(${specificsToString(specifics)})`;
}

export function getPixelSizeForLayoutSize(n: number) {
  return `getPixelSizeForLayoutSize(${n})`;
}

export function roundToNearestPixel(n: number) {
  return `roundToNearestPixel(${n})`;
}
