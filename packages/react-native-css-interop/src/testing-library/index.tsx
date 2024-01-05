import { ComponentProps, forwardRef } from "react";
import * as JSX from "react/jsx-runtime";

import { StyleSheet } from "../index";
import { INTERNAL_RESET } from "../shared";
import {
  CssInteropGeneratedProps,
  CssToReactNativeRuntimeOptions,
  EnableCssInteropOptions,
  ReactComponent,
  Style,
} from "../types";
import { cssToReactNativeRuntime } from "../css-to-rn";

import "../runtime/components";
import {
  cssInterop,
  remapProps,
  interopComponents,
} from "../runtime/components/api";
import { opaqueStyles } from "../runtime/native/globals";
import wrapJSX from "../runtime/wrap-jsx";

export * from "../types";
export { warnings } from "../runtime/native/globals";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyle(style?: Style | Style[]): R;
      toHaveAnimatedStyle(style?: Style): R;
    }
  }
}

const render = wrapJSX((JSX as any).jsx);

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent<
  const T extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<any>,
>(
  Component: T,
  mapping: EnableCssInteropOptions<T> & M = {
    className: "style",
  } as unknown as EnableCssInteropOptions<T> & M,
) {
  cssInterop(Component, mapping);

  const mock: any = jest.fn(({ ...props }, ref) => {
    // props.ref = ref;
    return render(Component, props, "", false, undefined, undefined);
  });

  return Object.assign((props: any) => mock(props), { mock });
}

export function createRemappedComponent<const T extends ReactComponent<any>>(
  Component: T,
  mapping: Parameters<typeof remapProps<any, any>>[1],
) {
  remapProps(Component, mapping);

  const mock: any = jest.fn((props, ref) => {
    // props.ref = ref;
    return render(Component, props, "", false, undefined, undefined);
  });

  return Object.assign(forwardRef(mock), { mock });
}

export const resetStyles = () => {
  StyleSheet[INTERNAL_RESET]();
};

export const resetComponents = () => {
  interopComponents.clear();
};

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  StyleSheet.registerCompiled(cssToReactNativeRuntime(css, options));
}

export function revealStyles(obj: any): any {
  switch (typeof obj) {
    case "string":
    case "number":
    case "bigint":
    case "boolean":
    case "symbol":
    case "undefined":
    case "function":
      return obj;
    case "object":
    default: {
      const style = opaqueStyles.get(obj);
      if (style) return style;

      return Object.fromEntries(
        Object.entries(obj).map(([key, value]): any => {
          switch (typeof value) {
            case "string":
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
            case "undefined":
            case "function":
              return [key, value];
            case "object":
            default: {
              if (Array.isArray(value)) {
                return [key, value.map(revealStyles)];
              } else if (value) {
                const style = opaqueStyles.get(value);
                return [key, style ?? value];
              } else {
                return [key, value];
              }
            }
          }
        }),
      );
    }
  }
}
