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

const fontScaleValue = 1;
const pixelScaleValue = 1;

export const hairlineWidth: HairlineWidth = () => {
  return 1;
};

export const platformSelect: PlatformSelect = (specifics) => {
  return specifics["web"] ?? specifics["default"];
};

export const platformColor: PlatformColor = (colors) => {
  return colors[colors.length - 1];
};

export const pixelRatio: PixelRatio = (value) => {
  if (typeof value !== "number") return pixelScaleValue;
  return value * pixelScaleValue;
};

export const pixelRatioSelect: PixelRatioSelect = (specifics) => {
  return specifics[1] ?? specifics["default"];
};

export const fontScale: FontScale = (value) => {
  if (!value) return fontScaleValue;
  return `calc(${value} * ${fontScaleValue})`;
};

export const fontScaleSelect: FontScaleSelect = (specifics) => {
  return specifics["web"] ?? specifics["default"];
};

export const getPixelSizeForLayoutSize: GetPixelSizeForLayoutSize = (value) => {
  return `calc(${value} * ${pixelScaleValue})`;
};

export const roundToNearestPixel: RoundToNearestPixel = (n) => {
  return n;
};
