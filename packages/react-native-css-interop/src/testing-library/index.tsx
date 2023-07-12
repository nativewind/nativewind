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
import { CssInteropPropMapping, ExtractionWarning, Style } from "../types";
import { warned, warnings } from "../runtime/shared/globals";

declare global {
  namespace jest {
    interface Matchers<R> {
      styleToEqual(style?: Style): R;
      toHaveStyleWarnings(warnings: Map<string, ExtractionWarning[]>): R;
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
  warnings.clear();
  warned.clear();
}

export function registerCSS(
  css: string,
  options?: CssToReactNativeRuntimeOptions,
) {
  StyleSheet.register(cssToReactNativeRuntime(css, options));
}
