import { getStylesForProperty } from "css-to-react-native";
import { PropertyFunction } from "./only";

export const flex: PropertyFunction<"flex"> = (value, name) => {
  const { flexGrow, flexShrink, flexBasis } = getStylesForProperty(name, value);
  return { flexGrow, flexShrink, flexBasis };
};
flex.prop = "flex";
