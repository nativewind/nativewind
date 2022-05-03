import { getStylesForProperty } from "css-to-react-native";
import { PropertyFunction } from "./only";

export const aspectRatio: PropertyFunction<"aspectRatio"> = (value) => {
  if (value === "0") {
    return {};
  } else if (typeof value === "string" && value.includes("/")) {
    const [left, right] = value.split("/").map((n) => {
      return Number.parseInt(n, 10);
    });

    return getStylesForProperty("aspectRatio", `${left / right}`);
  }

  return getStylesForProperty("aspectRatio", value);
};
aspectRatio.prop = "aspectRatio";
