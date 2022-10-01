import {
  StyleSheet,
  OpaqueColorValue,
  Platform,
  PlatformColor,
  PixelRatio,
} from "react-native";
import { VariableValue } from "../postcss/types";
import context from "./context";

export function resolve(
  style: VariableValue
): string | number | OpaqueColorValue | undefined {
  if (typeof style === "string" || typeof style === "number") {
    if (typeof style === "string") {
      const maybeNumber = Number.parseFloat(style);
      return Number.isNaN(maybeNumber) ? style : maybeNumber;
    }
    return style;
  }

  if ("__TYPE__" in style) return style;

  const resolvedValues = style.values.map((value) => resolve(value));

  switch (style.function) {
    case "inbuilt": {
      const [name, ...values] = resolvedValues;
      return [name, "(", values.join(", "), ")"].join("");
    }
    case "vw": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return (value / 100) * (context.topics["--window-width"] as number);
    }
    case "vh": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return (value / 100) * (context.topics["--window-height"] as number);
    }
    case "rem": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return value * (context.topics["--rem"] as number);
    }
    case "var": {
      const [variable, defaultValue] = resolvedValues;
      if (typeof variable !== "string") return;
      const value = context.topics[variable];
      if (!value) return defaultValue;
      if (typeof value === "object" && "function" in value) return defaultValue;
      return value;
    }
    case "hairlineWidth":
      return StyleSheet.hairlineWidth;
    case "platformSelect": {
      const specifics = toObject(resolvedValues);
      return Platform.select(specifics);
    }
    // case "platformColor": {
    //   return PlatformColor(
    //     ...resolvedValues.filter(
    //       (value): value is string => typeof value === "string"
    //     )
    //   );
    // }
    // case "pixelRatio": {
    //   if (resolvedValues.length > 0) {
    //     const specifics = resolveSpecifics(resolvedValues);
    //     return specifics[PixelRatio.get()];
    //   } else {
    //     return PixelRatio.get();
    //   }
    // }
    // case "fontScale": {
    // if (resolvedValues.length > 0) {
    //   const specifics = resolveSpecifics(resolvedValues);
    //   return specifics[PixelRatio.getFontScale()];
    // } else {
    //   return PixelRatio.getFontScale();
    // }
    // }
    case "getPixelSizeForLayoutSize": {
      const value = resolvedValues[0];
      if (typeof value !== "number") return;
      return PixelRatio.getPixelSizeForLayoutSize(value);
    }
    case "roundToNearestPixel": {
      const value = resolvedValues[0];
      if (typeof value !== "number") return;
      return PixelRatio.roundToNearestPixel(value);
    }
  }
}

function toObject(values: unknown[]) {
  const obj: Record<string, unknown> = {};
  for (let i = 0; i < values.length; i = i + 2) {
    obj[values[i] as string] = values[i + 1];
  }
  return obj;
}
