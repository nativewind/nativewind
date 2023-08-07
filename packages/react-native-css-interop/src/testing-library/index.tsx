import { forwardRef } from "react";
import * as JSX from "react/jsx-runtime";
import { Platform } from "react-native";

import { StyleSheet, enableCSSInterop } from "../index";
import { render } from "../runtime/render";
import { INTERNAL_RESET } from "../shared";
import {
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  Style,
} from "../types";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";

export {
  globalStyles,
  styleMetaMap,
  warnings,
} from "../runtime/native/globals";

import "../core-components";

export * from "../types";
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyle(style?: Style | Style[]): R;
      toHaveAnimatedStyle(style?: Style): R;
    }
  }
}

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent<
  P extends object,
  M = { className: "style" },
>(
  Component: React.ComponentType<P>,
  {
    mapping = { className: "style" } as unknown as EnableCssInteropOptions<P> &
      M,
  }: {
    mapping?: EnableCssInteropOptions<P> & M;
  } = {},
) {
  enableCSSInterop<P, M>(Component, mapping);

  return forwardRef<unknown, P>((props, _ref) => {
    return render((JSX as any).jsx, Component, props as any, "");
  }) as unknown as ComponentTypeWithMapping<P, M>;
}

export const resetStyles = StyleSheet[INTERNAL_RESET].bind(StyleSheet);

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  StyleSheet.register(
    cssToReactNativeRuntime(css, { ...options, platform: Platform.OS }),
  );
}
