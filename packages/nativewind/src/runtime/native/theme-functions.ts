import {
  FontScale,
  FontScaleSelect,
  GetPixelSizeForLayoutSize,
  HairlineWidth,
  PixelRatio,
  PixelRatioSelect,
  PlatformColor,
  PlatformSelect,
  RoundToNearestPixel,
} from "../types/theme-functions";

function specificsToString(specifics: Record<string, unknown>) {
  return Object.entries(specifics)
    .map(([key, value]) => {
      return Number.parseInt(key, 10)
        ? `_${key}(${value})`
        : `${key}(${value})`;
    })
    .join(", ");
}

export const hairlineWidth: HairlineWidth = () => {
  return `hairlineWidth()`;
};

export const platformSelect: PlatformSelect = (specifics) => {
  return `platformSelect(${specificsToString(specifics)})`;
};

export const platformColor: PlatformColor = (...colors) => {
  return `platformColor(${colors.join(", ")})`;
};

export const pixelRatio: PixelRatio = (value) => {
  return `pixelRatio(${value ?? ""})`;
};

export const pixelRatioSelect: PixelRatioSelect = (specifics) => {
  return `pixelRatioSelect(${specificsToString(specifics)})`;
};

export const fontScale: FontScale = (value) => {
  return `fontScale(${value ?? ""})`;
};

export const fontScaleSelect: FontScaleSelect = (specifics) => {
  return `fontScaleSelect(${specificsToString(specifics)})`;
};

export const getPixelSizeForLayoutSize: GetPixelSizeForLayoutSize = (n) => {
  return `getPixelSizeForLayoutSize(${n})`;
};

export const roundToNearestPixel: RoundToNearestPixel = (n) => {
  return `roundToNearestPixel(${n})`;
};
