/* eslint-disable unicorn/prefer-module */
const {
  hairlineWidth,
  platformSelect,
  platformColor,
  pixelRatio,
  pixelRatioSelect,
  fontScale,
  fontScaleSelect,
  getPixelSizeForLayoutSize,
  roundToNearestPixel,
} =
  process.env.NATIVEWIND_PLATFORM === "native"
    ? require("./index.native")
    : require("./index.web");

export {
  hairlineWidth,
  platformSelect,
  platformColor,
  pixelRatio,
  pixelRatioSelect,
  fontScale,
  fontScaleSelect,
  getPixelSizeForLayoutSize,
  roundToNearestPixel,
};
