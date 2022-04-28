import { getStylesForProperty, Style } from "css-to-react-native";

export function flex(value: string, name: string): Style {
  const { flexGrow, flexShrink } = getStylesForProperty(name, value);
  return { flexGrow, flexShrink };
}
