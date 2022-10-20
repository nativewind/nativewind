/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prefer-module */

import { PlatformOSType } from "react-native";

interface DeviceFunctions {
  hairlineWidth: () => any;
  platformSelect: (
    specifics: Partial<Record<PlatformOSType | "default", string | number>>
  ) => any;
  platformColor: (...colors: string[]) => any;
  pixelRatio: (value?: number) => any;
  pixelRatioSelect: (values: Record<number, number | string>) => any;
  fontScale: (value?: number) => any;
  fontScaleSelect: (values: Record<number, number | string>) => any;
  getPixelSizeForLayoutSize: (value: number) => any;
  roundToNearestPixel: (value: number) => any;
}

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
} = (
  process.env.NATIVEWIND_PLATFORM === "native"
    ? require("./index.native")
    : require("./index.web")
) as DeviceFunctions;

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
