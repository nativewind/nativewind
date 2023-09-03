import type { ComponentType } from "react";
import type { BasicInteropFunction, JSXFunction } from "../types";

type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

export const interopFunctions = new WeakMap<
  ComponentType<any>,
  BasicInteropFunction
>();

export function render<P>(
  jsx: JSXFunction<P>,
  type: Parameters<JSXFunction<P>>[0],
  ...args: Tail<Parameters<JSXFunction<P>>>
) {
  if (typeof type === "string") {
    // Used by the doctor to check if the interop is working
    if (__DEV__ && type === "react-native-css-interop-jsx-pragma-check") {
      return true;
    }
    // String components are not supported by the interop
    return jsx(type, ...args);
  }
  const cssInterop = interopFunctions.get(type);
  return cssInterop ? cssInterop(jsx, type, ...args) : jsx(type, ...args);
}

export function renderWithInterop<P>(
  jsx: JSXFunction<P>,
  interop: BasicInteropFunction,
  ...args: Parameters<JSXFunction<P>>
) {
  return interop(jsx, ...args);
}
