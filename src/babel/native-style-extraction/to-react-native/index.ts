import { Declaration } from "postcss";
import {
  getPropertyName,
  getStylesForProperty,
  Style,
} from "css-to-react-native";

import { properties } from "./properties";
import { isInvalidProperty, StyleProperty } from "./is-invalid-property";
import { StyleError } from "../../../types/common";

export interface ToReactNativeOptions {
  onError: (options: StyleError) => void;
}

export function toReactNative(
  declaration: Declaration,
  { onError }: ToReactNativeOptions
) {
  const { prop, value } = declaration;

  const name = getPropertyName(prop) as StyleProperty;

  let styles: Style | undefined;

  if (isInvalidProperty(name)) {
    onError({
      declaration,
      error: new Error("invalid property"),
      result: styles,
    });
    return;
  }

  try {
    const transform = properties[name];
    styles = transform
      ? transform(value, name)
      : getStylesForProperty(name, value);
  } catch (error) {
    if (error instanceof Error) {
      onError({ declaration, error, result: styles });
    }
    return;
  }

  return styles;
}
