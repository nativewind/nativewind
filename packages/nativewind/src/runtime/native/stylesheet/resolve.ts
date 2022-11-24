import {
  StyleSheet,
  Platform,
  PixelRatio,
  ColorValue,
  PlatformColor,
} from "react-native";
import { ShadowValue, VariableValue } from "../../../transform-css/types";
import { rem, vh, vw } from "../../common";
import { variables } from "./runtime";

interface ObjectAttribute {
  key: string;
  value: unknown;
}

export type ResolvedValue =
  | string
  | number
  | ColorValue
  | ObjectAttribute
  | ShadowValue
  | undefined;

export function resolve(style?: VariableValue): ResolvedValue {
  if (!style) return;

  if (typeof style === "string") {
    return style;
  }

  if (typeof style === "number") {
    return style;
  }

  if ("__TYPE__" in style) return style;

  if (!("values" in style)) return style;

  const resolvedValues = style.values.map((value) => resolve(value));

  if (style.function.startsWith("_")) {
    return {
      key: style.function.slice(1),
      value: resolvedValues[0],
    };
  }

  switch (style.function) {
    case "toRGB": {
      const [value] = resolvedValues;
      if (typeof value === "string" && value.startsWith("rgba")) {
        const rgba = value.match(/\d+/g) ?? [];
        return `rgb(${rgba[0]}, ${rgba[1]}, ${rgba[2]})`;
      } else {
        return value;
      }
    }
    case "rgbOpacity": {
      const [value] = resolvedValues;
      if (typeof value === "string" && value.startsWith("rgba")) {
        const rgba = value.match(/(\d*\.?\d+)/g) ?? [];
        return Number.parseFloat(rgba[3]);
      } else {
        return value;
      }
    }
    case "inbuilt": {
      const [name, ...values] = resolvedValues;
      return [name, "(", values.join(", "), ")"].join("");
    }
    case "vw": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      if (!value) return 0;
      return (value / 100) * (variables.get(vw) as number);
    }
    case "vh": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      if (!value) return 0;
      return (value / 100) * (variables.get(vh) as number);
    }
    case "rem": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      if (!value) return 0;
      return value * (variables.get(rem) as number);
    }
    case "var": {
      const [variable, defaultValue] = resolvedValues;
      if (typeof variable !== "string") return;
      const value = variables.get(variable);
      if (!value) return defaultValue;
      if (typeof value === "object" && "function" in value) return defaultValue;
      return value;
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }
    case "platformSelect": {
      const specifics = toObject(resolvedValues);
      return Platform.select(specifics);
    }
    case "platformColor": {
      return PlatformColor(
        ...resolvedValues.filter(
          (value): value is string => typeof value === "string"
        )
      );
    }
    case "pixelRatio": {
      const value = resolvedValues[0];
      return typeof value === "number"
        ? PixelRatio.get() * value
        : PixelRatio.get();
    }
    case "pixelRatioSelect": {
      const specifics = toObject(resolvedValues) as Record<
        number,
        ResolvedValue
      >;
      return specifics[PixelRatio.get()];
    }
    case "fontScale": {
      const value = resolvedValues[0];
      return typeof value === "number"
        ? PixelRatio.getFontScale() * value
        : PixelRatio.getFontScale();
    }
    case "fontScaleSelect": {
      const specifics = toObject(resolvedValues) as Record<
        number,
        ResolvedValue
      >;
      return specifics[PixelRatio.getFontScale()];
    }
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
    case "ios":
    case "android":
    case "windows":
    case "macos":
    case "web":
    case "default": {
      return {
        key: style.function,
        value: resolvedValues[0],
      };
    }
  }
}

function toObject(values: ResolvedValue[]) {
  const object: Record<string, unknown> = {};
  for (const entry of values) {
    if (typeof entry === "object" && "value" in entry) {
      object[entry.key] = entry.value;
    }
  }
  return object;
}
