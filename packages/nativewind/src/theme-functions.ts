import { parse } from "css-tree";
import { PlatformOSType } from "react-native";
import { parseStyleValue } from "./postcss/transforms/push";

type PlatformFunctionString = string;

function resolveValue(value: string): string {
  const ast = parse(value, { context: "value" });

  if (ast.type !== "Value") {
    return "";
  }

  return JSON.stringify(
    parseStyleValue(ast.children.toArray()[0], [])
  ).replaceAll(/(\W)/g, "\\$1");
}

export const platformSelect = (
  value:
    | Partial<Record<PlatformOSType | "default", unknown>>
    | PlatformFunctionString
) => {
  const specifics =
    typeof value === "string"
      ? value
      : Object.entries(value)
          .map((entry) => {
            return `${entry[0]}__${resolveValue(`${entry[1]}`)}`;
          })
          .join(",");

  // console.log({ specifics });
  return `platformSelect(${specifics})`;
};

// export const platformColor = (color: PlatformFunctionString) =>
//   create("platformColor", color);

// export const hairlineWidth = () => create("hairlineWidth");

// export const pixelRatio = (
//   v: number | Record<string, number> | PlatformFunctionString
// ) => create("pixelRatio", v);

// export const fontScale = (
//   v: number | Record<string, number> | PlatformFunctionString
// ) => create("fontScale", v);

// export const getPixelSizeForLayoutSize = (n: number | PlatformFunctionString) =>
//   create("getPixelSizeForLayoutSize", n);

// export const roundToNearestPixel = (n: number | PlatformFunctionString) =>
//   create("roundToNearestPixel", n);
