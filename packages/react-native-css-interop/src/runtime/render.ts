import type { ComponentType } from "react";
import type { BasicInteropFunction, JSXFunction } from "../types";

export const interopFunctions = new WeakMap<
  ComponentType<any>,
  BasicInteropFunction
>();

export function render<P>(
  jsx: JSXFunction<P>,
  type: any,
  props: P,
  key?: string,
  cssInterop?: BasicInteropFunction,
) {
  if (
    __DEV__ &&
    typeof type === "string" &&
    type === "react-native-css-interop-jsx-pragma-check"
  ) {
    return true;
  }

  if (typeof type === "string") {
    return jsx(type, props, key);
  }

  cssInterop ??= interopFunctions.get(type);
  return cssInterop ? cssInterop(jsx, type, props, key) : jsx(type, props, key);
}
