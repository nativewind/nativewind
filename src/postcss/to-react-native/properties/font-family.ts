import { getStylesForProperty } from "css-to-react-native";

export function fontFamily(value: string, name: string) {
  return getStylesForProperty(name, value.split(",")[0]);
}
