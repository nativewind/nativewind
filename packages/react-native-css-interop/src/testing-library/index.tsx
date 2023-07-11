import React, {
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import { View, ViewProps } from "react-native";

import { defaultCSSInterop } from "../runtime/css-interop";
import { StyleSheet } from "../index";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";
import { CssInteropPropMapping } from "../types";

declare global {
  namespace jest {
    interface Matchers<R> {
      styleToEqual(
        style?: Record<string, unknown> | Record<string, unknown>[],
      ): R;
      toHaveAnimatedStyle(
        style?: Record<string, unknown> | Record<string, unknown>[],
      ): R;
    }
  }
}

type MockComponentProps = ViewProps & { className?: string };

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent(
  Component: React.ComponentType<any> = View,
  mapping?: CssInteropPropMapping,
): ForwardRefExoticComponent<
  MockComponentProps & RefAttributes<MockComponentProps>
> {
  const component = jest.fn((props, ref) => <Component ref={ref} {...props} />);
  const componentForwarded = React.forwardRef(component);
  const componentWithRef = React.forwardRef<MockComponentProps>(
    (props, ref) => {
      return defaultCSSInterop(
        (ComponentType: ComponentType<any>, props: object, key: string) => {
          return <ComponentType ref={ref} key={key} {...props} />;
        },
        componentForwarded,
        props,
        "any-string-value",
        mapping,
      );
    },
  );

  return Object.assign(componentWithRef, {
    mock: component.mock,
  });
}

export function resetStyles() {
  StyleSheet.__reset();
}

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  StyleSheet.register(cssToReactNativeRuntime(css, options));
}
