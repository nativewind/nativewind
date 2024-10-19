import type { PlatformOSType } from "react-native";

export function hairlineWidth() {
  return "hairlineWidth()";
}

export function platformSelect(
  specifics: Partial<Record<PlatformOSType | "default", unknown>>,
) {
  let output: string[] = [];
  for (const [key, value] of Object.entries(specifics)) {
    output.push(`${key}/${value}`);
  }
  return `platformSelect(${output.join(",")})`;
}

export function pixelScaleSelect(
  specifics: Partial<Record<number | "default", unknown>>,
) {
  let output: string[] = [];
  for (const [key, value] of Object.entries(specifics)) {
    output.push(`${key}/${value}`);
  }
  return `pixelScaleSelect(${output.join(",")})`;
}

export function fontScaleSelect(
  specifics: Partial<Record<number | "default", unknown>>,
) {
  let output: string[] = [];
  for (const [key, value] of Object.entries(specifics)) {
    output.push(`${key}/${value}`);
  }
  return `fontScaleSelect(${output.join(",")})`;
}

export function pixelScale(value?: number) {
  return value === undefined ? `pixelScale()` : `pixelScale(${value})`;
}

export function fontScale(value?: number) {
  return value === undefined ? `fontScale()` : `fontScale(${value})`;
}

export function getPixelSizeForLayoutSize(value: number) {
  return `getPixelSizeForLayoutSize(${value})`;
}

export function roundToNearestPixel(value: number) {
  return `roundToNearestPixel(${value})`;
}

export function platformColor(...colors: string[]) {
  return `platformColor(${colors
    .map((color) => {
      // Android uses these characters which we must escape when outputting to CSS
      return color
        .replaceAll("?", "\\?")
        .replaceAll("/", "\\/")
        .replaceAll(":", "\\:");
    })
    .join(",")})`;
}
