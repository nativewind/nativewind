import { getStylesForProperty, Style } from "css-to-react-native";
import { StyleProperty } from "../is-invalid-property";
import { aspectRatio } from "./aspect-ratio";
import { flex } from "./flex";
import { position } from "./position";

function only(name: string, values: string[]) {
  const supportedValues = new Set(values);
  return (value: string): Style => {
    if (!supportedValues.has(value)) {
      throw new Error(name);
    }

    return getStylesForProperty(name, value);
  };
}

function noAuto(value: string, name: string): Style {
  if (value === "auto") {
    throw new Error("no auto");
  }

  return getStylesForProperty(name, value);
}

export const properties: Partial<
  Record<StyleProperty, (value: string, name: string) => Style>
> = {
  aspectRatio,
  alignContent: only("alignContent", [
    "flex-start",
    "flex-end",
    "stretch",
    "center",
    "space-between",
    "space-around",
  ]),
  display: only("display", ["none", "flex"]),
  flex,
  overflow: only("overflow", ["visible", "hidden", "scroll"]),
  position,
  flexBasis: noAuto,
  top: noAuto,
  bottom: noAuto,
  left: noAuto,
  right: noAuto,
  margin: noAuto,
  marginTop: noAuto,
  marginRight: noAuto,
  marginBottom: noAuto,
  marginLeft: noAuto,
  zIndex: noAuto,
};
