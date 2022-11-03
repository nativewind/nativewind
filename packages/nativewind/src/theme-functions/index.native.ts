import type { PlatformOSType } from "react-native";
import type { DeviceFunctions } from ".";

function specificsToString(specifics: Record<string, unknown>) {
  return Object.entries(specifics)
    .map(([key, value]) => {
      return Number.parseInt(key, 10)
        ? `_${key}(${value})`
        : `${key}(${value})`;
    })
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

export function platformColor(...colors: string[]) {
  return `platformColor(${colors.join(", ")})`;
}

export function pixelRatio(value?: number) {
  return `pixelRatio(${value ?? ""})`;
}

export function pixelRatioSelect(specifics: Record<string, number | string>) {
  return `pixelRatioSelect(${specificsToString(specifics)})`;
}

export function fontScale(value?: number) {
  return `fontScale(${value ?? ""})`;
}

export const fontScaleSelect: DeviceFunctions["fontScaleSelect"] = (
  specifics
) => {
  return `fontScaleSelect(${specificsToString(specifics)})`;
};

export const getPixelSizeForLayoutSize: DeviceFunctions["getPixelSizeForLayoutSize"] =
  (n) => {
    return `getPixelSizeForLayoutSize(${n})`;
  };

export const roundToNearestPixel: DeviceFunctions["roundToNearestPixel"] = (
  n
) => {
  return `roundToNearestPixel(${n})`;
};
