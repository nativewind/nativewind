import {
  forwardRef,
  ComponentType,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import { Platform, View, ViewProps } from "react-native";

import { defaultCSSInterop } from "../runtime/css-interop";
import { StyleSheet } from "../index";
import {
  CssToReactNativeRuntimeOptions,
  cssToReactNativeRuntime,
} from "../css-to-rn";
import {
  CssInteropPropMapping,
  ExtractionWarning,
  Style,
  StyleMeta,
} from "../types";
import { createPropMapper, render } from "../runtime/render";

declare global {
  namespace jest {
    interface Matchers<R> {
      styleToEqual(style?: Style): R;
      styleMetaToEqual(meta?: StyleMeta): R;
      toHaveStyleWarnings(warnings?: Map<string, ExtractionWarning[]>): R;
      toHaveAnimatedStyle(style?: Style): R;
    }
  }
}

type MockComponentProps = ViewProps & { className?: string };
type MockComponent = ForwardRefExoticComponent<
  MockComponentProps & RefAttributes<MockComponentProps>
> &
  jest.Mock<JSX.Element, [props: any, ref: any], any>;

/*
 * Creates a mocked component that renders with the defaultCSSInterop WITHOUT needing
 * set the jsxImportSource.
 */
export function createMockComponent(
  Component: React.ComponentType<any> = View,
  mapping = { className: "style" },
): MockComponent {
  const spy = jest.fn((props, ref) => <Component ref={ref} {...props} />);

  // We need to forward the ref through the mock that Jest creates
  const spyWithRef = forwardRef(spy);

  const mappingMap = new Map(Object.entries(mapping));

  return Object.assign(
    // Create a wrapper that manually calls our jsxImportSource without changing the default jsxImportSource
    forwardRef<MockComponentProps>((props: Record<string, unknown>, ref) => {
      return render(
        // Create a fake `jsx` function. This will render the component called the real jsxImportSource
        (ComponentType: ComponentType<any>, props: object, key?: string) => {
          return <ComponentType ref={ref} key={key} {...props} />;
        },
        spyWithRef,
        props,
        props.key?.toString(),
        undefined,
        (jsx, type, props, key) => {
          return defaultCSSInterop(jsx, type, props, key, mappingMap);
        },
      );
    }),
    // Append the mock so we can access it
    spy,
  );
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
