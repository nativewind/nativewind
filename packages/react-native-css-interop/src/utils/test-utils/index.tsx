import * as JSX from "react/jsx-runtime";
import { ComponentProps, ComponentType, forwardRef } from "react";

import wrapJSX from "../../runtime/wrap-jsx";
import { INTERNAL_SET } from "../../shared";
import { cssInterop, remapProps, interopComponents } from "../../runtime/api";
import { cssToReactNativeRuntime } from "../../css-to-rn";
import { injectData, resetData } from "../../runtime/native/$$styles";
import { vh, vw } from "../../runtime/native/unit-observables";
import {
  CssToReactNativeRuntimeOptions,
  EnableCssInteropOptions,
  ReactComponent,
  Style,
  CssInteropGeneratedProps,
} from "../../types";
import { isReduceMotionEnabled } from "../../runtime/native/appearance-observables";

export * from "../../index";
export * from "../../runtime/native/$$styles";
export * from "../../types";
export * from "@testing-library/react-native";
export { INTERNAL_SET } from "../../shared";

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveStyle(style?: Style | Style[]): R;
      toHaveAnimatedStyle(style?: Style): R;
    }
  }
}

beforeEach(() => {
  resetData();
  vw[INTERNAL_SET](750);
  vw[INTERNAL_SET](750);
});

export const native: {
  vw: typeof vw;
  vh: typeof vh;
  isReduceMotionEnabled: typeof isReduceMotionEnabled;
} = {
  vw,
  vh,
  isReduceMotionEnabled,
};

const renderJSX = wrapJSX((JSX as any).jsx);

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

  return Object.assign(forwardRef(mock), { mock }) as unknown as ComponentType<
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

  const mock: any = jest.fn(({ ...props }, ref) => {
    props.ref = ref;
    return renderJSX(Component, props, "", false, undefined, undefined);
  });

  return Object.assign(forwardRef(mock), { mock }) as unknown as ComponentType<
    ComponentProps<T> & CssInteropGeneratedProps<M>
  >;
};

export const resetComponents = () => {
  interopComponents.clear();
};

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  const compiled = cssToReactNativeRuntime(css, options);
  injectData(compiled);
}

export function setupAllComponents() {
  require("../../runtime/components");
}
