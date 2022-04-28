import { getStylesForProperty, Style } from "css-to-react-native";
import { StyleProperty } from "../is-invalid-property";
import { aspectRatio } from "./aspect-ratio";
import { display } from "./display";
import { flex } from "./flex";
import { overflow } from "./overflow";
import { position } from "./position";

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
  display,
  flex,
  overflow,
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
