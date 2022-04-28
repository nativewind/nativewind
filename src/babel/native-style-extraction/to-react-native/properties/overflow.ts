import { getStylesForProperty, Style } from "css-to-react-native";

const supportedValues = new Set(["visible", "hidden", "scroll"]);

export function overflow(value: string): Style {
  if (!supportedValues.has(value)) {
    throw new Error("overflow");
  }

  return getStylesForProperty("overflow", value);
}
