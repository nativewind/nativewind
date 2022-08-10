import { PlatformOSType } from "react-native";

type PlatformFunctionString = string;

function create(name: string, ...args: unknown[]): PlatformFunctionString {
  const json = JSON.stringify({ name, args });
  return `__${json}`;
}

export const platformSelect = (
  value:
    | Partial<Record<PlatformOSType | "default", unknown>>
    | PlatformFunctionString
) => create("platformSelect", value);

export const platformColor = (color: PlatformFunctionString) =>
  create("platformColor", color);

export const hairlineWidth = () => create("hairlineWidth");

export const pixelRatio = (
  v: number | Record<string, number> | PlatformFunctionString
) => create("pixelRatio", v);

export const fontScale = (
  v: number | Record<string, number> | PlatformFunctionString
) => create("fontScale", v);

export const getPixelSizeForLayoutSize = (n: number | PlatformFunctionString) =>
  create("getPixelSizeForLayoutSize", n);

export const roundToNearestPixel = (n: number | PlatformFunctionString) =>
  create("roundToNearestPixel", n);
