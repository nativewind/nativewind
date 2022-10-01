import { PlatformOSType } from "react-native";

export const hairlineWidth = () => `hairlineWidth()`;

export const platformSelect = (
  value: Partial<Record<PlatformOSType | "default", string | number>>
) => {
  const specifics = Object.entries(value).flat().join(",");
  return `platformSelect(${specifics})`;
};

export const pixelRatio = (value?: Record<string, number | string>) => {
  if (value === undefined) {
    return "pixelRatio()";
  }
  const specifics = Object.entries(value).flat().join(",");
  return `pixelRatio(${specifics})`;
};

// export const platformColor = (color: PlatformFunctionString) =>
//   create("platformColor", color);

// export const fontScale = (
//   v: number | Record<string, number> | PlatformFunctionString
// ) => create("fontScale", v);

// export const getPixelSizeForLayoutSize = (n: number | PlatformFunctionString) =>
//   create("getPixelSizeForLayoutSize", n);

// export const roundToNearestPixel = (n: number | PlatformFunctionString) =>
//   create("roundToNearestPixel", n);
