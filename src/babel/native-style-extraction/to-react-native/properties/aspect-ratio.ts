import { getStylesForProperty, Style } from "css-to-react-native";

export function aspectRatio(value: string): Style {
  if (value === "0") {
    return {};
  } else if (typeof value === "string" && value.includes("/")) {
    const [left, right] = value.split("/").map((n) => {
      return Number.parseInt(n, 10);
    });

    return { aspectRatio: left / right };
  }

  return getStylesForProperty("aspectRatio", value);
}
