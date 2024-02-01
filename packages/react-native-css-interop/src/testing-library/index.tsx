import * as JSX from "react/jsx-runtime";
import { render as tlRender } from "@testing-library/react-native";

import { StyleSheet } from "../index";
import { INTERNAL_RESET } from "../shared";
import {
  CssToReactNativeRuntimeOptions,
  EnableCssInteropOptions,
  ReactComponent,
  Style,
  CssInteropGeneratedProps,
} from "../types";
import { cssToReactNativeRuntime } from "../css-to-rn";

import "../runtime/components";
import { cssInterop, remapProps, interopComponents } from "../runtime/web/api";
import wrapJSX from "../runtime/wrap-jsx";
import { ComponentProps, ComponentType, forwardRef } from "react";
import { opaqueStyles } from "../runtime/native/style-store";

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

export const renderJSX = wrapJSX((JSX as any).jsx);
export const render: typeof tlRender = (component: any, options?: any) =>
  tlRender(
    renderJSX(component.type, component.props, component.key) as any,
    options,
  );

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export const createMockComponent = <
  const T extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<any> = {
    className: "style";
  },
>(
  Component: T,
  mapping: M = {
    className: "style",
  } as unknown as M,
) => {
  cssInterop(Component, mapping);

  const mock: any = jest.fn(({ ...props }, ref) => {
    props.ref = ref;
    return renderJSX(Component, props, "", false, undefined, undefined);
  });

  return Object.assign(forwardRef(mock), { mock }) as ComponentType<
    ComponentProps<T> & CssInteropGeneratedProps<M>
  > & { mock: typeof mock };
};

export const createRemappedComponent = <
  const T extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<any> = {
    className: "style";
  },
>(
  Component: T,
  mapping: M = {
    className: "style",
  } as unknown as M,
) => {
  remapProps(Component, mapping);

  const mock: any = jest.fn((props, ref) => {
    props.ref = ref;
    return renderJSX(Component, props, "", false, undefined, undefined);
  });

  return Object.assign(forwardRef(mock), { mock }) as ComponentType<
    ComponentProps<T> & CssInteropGeneratedProps<M>
  >;
};

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
