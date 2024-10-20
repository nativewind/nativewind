import {
  ComponentProps,
  ComponentRef,
  ForwardedRef,
  forwardRef,
  ReactElement,
} from "react";

import {
  render as tlRender,
  RenderOptions as TLRenderOptions,
} from "@testing-library/react-native";

import { cssToReactNativeRuntime } from "../css-to-rn";
import { createInteropElement } from "../runtime";
import { cssInterop, interopComponents, remapProps } from "../runtime/api";
import { isReduceMotionEnabled } from "../runtime/native/appearance-observables";
import { warnings } from "../runtime/native/globals";
import { injectData, resetData } from "../runtime/native/styles";
import { vh, vw } from "../runtime/native/unit-observables";
import { INTERNAL_SET } from "../shared";
import {
  CssToReactNativeRuntimeOptions,
  EnableCssInteropOptions,
  ReactComponent,
  Style,
} from "../types";

export * from "../index";
export * from "../runtime/native/styles";
export * from "../types";
export * from "@testing-library/react-native";
export { INTERNAL_SET } from "../shared";

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

export interface RenderOptions extends TLRenderOptions {
  css?: string;
  cssOptions?: CssToReactNativeRuntimeOptions;
  debugCompiled?: boolean;
}

export function render(
  component: ReactElement<any>,
  { css, cssOptions, debugCompiled, ...options }: RenderOptions = {},
) {
  if (debugCompiled) {
    if (css) {
      console.log(`Generated css:\n\n${css}`);
    } else {
      console.log(`Generated css:\n\n<empty string>`);
    }
  }

  if (css) {
    registerCSS(css, { ...cssOptions, debugCompiled: debugCompiled });
  }

  return tlRender(component, options);
}

render.debug = (component: ReactElement<any>, options: RenderOptions = {}) => {
  return render(component, { ...options, debugCompiled: true });
};

export function getWarnings() {
  return warnings;
}

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent<
  const C extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<C>,
>(Component: C, mapping: M & EnableCssInteropOptions<C>) {
  cssInterop(Component, mapping);

  const mock = jest.fn(
    ({ ...props }: ComponentProps<C>, ref: ForwardedRef<ComponentRef<C>>) => {
      return createInteropElement(Component, { ...props, ref });
    },
  );

  return Object.assign(forwardRef(mock), {
    mock,
  });
}

export function createRemappedComponent<
  const C extends ReactComponent<any>,
  const M extends EnableCssInteropOptions<C>,
>(Component: C, mapping: M & EnableCssInteropOptions<C>) {
  remapProps(Component, mapping);

  const mock = jest.fn(
    ({ ...props }: ComponentProps<C>, ref: ForwardedRef<ComponentRef<C>>) => {
      return createInteropElement(Component, { ...props, ref });
    },
  );

  return Object.assign(forwardRef(mock), {
    mock,
  });
}

export const resetComponents = () => {
  interopComponents.clear();
};

export function registerCSS(
  css: string,
  {
    debugCompiled = process.env.NODE_OPTIONS?.includes("--inspect"),
    ...options
  }: CssToReactNativeRuntimeOptions & { debugCompiled?: boolean } = {},
) {
  const compiled = cssToReactNativeRuntime(css, options);
  if (debugCompiled) {
    console.log(`Compiled styles:\n\n${JSON.stringify({ compiled }, null, 2)}`);
  }
  injectData(compiled);
}

registerCSS.debug = (
  css: string,
  options: CssToReactNativeRuntimeOptions = {},
) => {
  registerCSS(css, { ...options, debugCompiled: true });
};

registerCSS.noDebug = (
  css: string,
  options: CssToReactNativeRuntimeOptions = {},
) => {
  registerCSS(css, { ...options, debugCompiled: false });
};

export const testID = "react-native-css-interop";

export function setupAllComponents() {
  require("../runtime/components");
}
