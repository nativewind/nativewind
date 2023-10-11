import { ComponentType, ReactNode, createElement } from "react";
import type { BasicInteropFunction, JSXFunction } from "../types";

export type InteropTypeCheck<T> = {
  type: ComponentType<T>;
  check: (props: T) => boolean;
  createElementWithInterop: (
    props: any,
    children: ReactNode,
  ) => ReturnType<typeof createElement>;
};
export const interopComponents = new WeakMap<object, InteropTypeCheck<any>>();

export function render<P>(
  jsx: JSXFunction<P>,
  type: any,
  props: any,
  ...args: Parameters<JSXFunction<P>> extends [any, any, ...infer R] ? R : never
) {
  if (__DEV__) {
    if (type === "react-native-css-interop-jsx-pragma-check") {
      return true;
    }
  }

  const interop = interopComponents.get(type) as
    | InteropTypeCheck<P>
    | undefined;

  if (!interop || !interop.check(props)) return jsx(type, props, ...args);

  return jsx(interop.type, props, ...args);
}

export function renderWithInterop<P>(
  jsx: JSXFunction<P>,
  interop: BasicInteropFunction,
  ...args: Parameters<JSXFunction<P>>
) {
  return interop(jsx, ...args);
}

export function createElementAndCheckCssInterop(
  ...args: Parameters<typeof createElement>
) {
  const type = args[0];

  if (!type) return createElement(...args);

  const interop = interopComponents.get(type as object);

  return !interop || !interop.check(args[1])
    ? createElement(...args)
    : interop.createElementWithInterop(args[1], args.slice(2) as ReactNode);
}
