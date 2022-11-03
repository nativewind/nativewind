/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/prefer-module */

import { PlatformOSType } from "react-native";

export interface DeviceFunctions {
  hairlineWidth: () => any;
  platformSelect: (
    specifics: Partial<Record<PlatformOSType | "default", string | number>>
  ) => any;
  platformColor: (...colors: string[]) => any;
  pixelRatio: (value?: number | string) => any;
  pixelRatioSelect: (values: Record<number, number | string>) => any;
  fontScale: (value?: number | string) => any;
  fontScaleSelect: (values: Record<string, number | string>) => any;
  getPixelSizeForLayoutSize: (value: number | string) => any;
  roundToNearestPixel: (value: number | string) => any;
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
  process.env.NATIVEWIND_NATIVE
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
