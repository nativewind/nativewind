import { getStylesForProperty } from "css-to-react-native";
import { PropertyFunction } from "./only";

export const flex: PropertyFunction<"flex"> = (value, name) => {
  const { flexGrow, flexShrink } = getStylesForProperty(name, value);
  return { flexGrow, flexShrink };
};
flex.prop = "flex";
