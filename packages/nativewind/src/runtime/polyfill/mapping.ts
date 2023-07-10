import type { ComponentType } from "react";

export type InteropFunction = (
  jsx: Function,
  type: any,
  props: Record<string | number, unknown>,
  key: string,
) => any;

export const polyfillMapping = new WeakMap<
  ComponentType<any>,
  InteropFunction
>();
