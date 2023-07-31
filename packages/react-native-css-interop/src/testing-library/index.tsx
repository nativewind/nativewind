import { forwardRef } from "react";
import * as JSX from "react/jsx-runtime";
import { Platform } from "react-native";

import { Style, StyleMeta } from "../types";
import { StyleSheet } from "../index";
import { defaultCSSInterop } from "../runtime/css-interop";
import { render } from "../runtime/render";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyle(style?: Style): R;
      toHaveStyleMeta(meta?: StyleMeta): R;
      toHaveAnimatedStyle(style?: Style): R;
    }
  }
}

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent(
  Component: React.ComponentType<any>,
  { mapping = { className: "style" } } = {},
): typeof Component {
  const mappingMap = new Map(Object.entries(mapping));

  return forwardRef((props, ref) => {
    return render(
      (JSX as any).jsx,
      Component,
      props as any,
      "",
      undefined,
      (jsx, type, props, key) => {
        return defaultCSSInterop(jsx, type, { ...props, ref }, key, mappingMap);
      },
    );
  });
}

export function resetStyles() {
  StyleSheet.__reset();
}

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  StyleSheet.register(
    cssToReactNativeRuntime(css, { ...options, platform: Platform.OS }),
  );
}
