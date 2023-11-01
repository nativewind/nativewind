import {
  ComponentType,
  PropsWithChildren,
  createElement,
  forwardRef,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  VirtualizedList,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";

import { defaultCSSInterop } from "./runtime/css-interop";
import { InteropTypeCheck, interopComponents, render } from "./runtime/render";
import type {
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  InteropFunction,
} from "./types";
import { getNormalizeConfig } from "./runtime/native/prop-mapping";
import { styleMetaMap } from "./runtime/native/misc";
import { remapProps } from "./runtime/css-interop";

export function unstable_styled<P extends object, M>(
  component: ComponentType<P>,
  mapping?: EnableCssInteropOptions<P> & M,
  interop: InteropFunction = defaultCSSInterop,
) {
  if (mapping) {
    cssInterop(component, mapping, interop);
  }

  return forwardRef<unknown, any>((props, _ref) => {
    return render<any>(
      (element, { children, ...props }, key) => {
        children = Array.isArray(children) ? children : [children];
        return createElement(element, { key, ...props }, ...children);
      },
      component,
      props as any,
      props.key,
    );
  }) as unknown as ComponentTypeWithMapping<P, M>;
}

export function cssInterop<T extends {}, M>(
  component: ComponentType<T>,
  mapping: EnableCssInteropOptions<T> & M,
  interop: InteropFunction = defaultCSSInterop,
) {
  const config = getNormalizeConfig(mapping);

  let render: any = <P extends { ___pressable?: true }>(
    { children, ___pressable, ...props }: PropsWithChildren<P>,
    ref: unknown,
  ) => {
    if (ref) {
      (props as any).ref = ref;
    }

    if (___pressable) {
      return createElement(component, props as unknown as T, children);
    } else {
      return createElement(
        ...interop(component, config, props as unknown as T, children),
      );
    }
  };

  if (__DEV__) {
    render.displayName = `CSSInterop.${
      component.displayName ?? component.name ?? "unknown"
    }`;
  }

  render = forwardRef(render);

  const checkArray = (props: any[]) =>
    props.some((prop): boolean => {
      return Array.isArray(prop) ? checkArray(prop) : styleMetaMap.has(prop);
    });

  const interopComponent: InteropTypeCheck<T> = {
    type: render,
    createElementWithInterop(props, children) {
      return createElement(...interop(component, config, props, children));
    },
    check(props) {
      for (const [
        targetProp,
        { sources, nativeStyleToProp },
      ] of config.config) {
        if (nativeStyleToProp) return true;

        for (const source of sources) {
          if (typeof props[source] === "string") {
            return true;
          }
        }

        const target: any = props[targetProp];

        if (Array.isArray(target)) {
          if (checkArray(target)) {
            return true;
          }
        } else if (styleMetaMap.has(target)) {
          return true;
        }
      }

      return false;
    },
  };

  interopComponents.set(component, interopComponent);
}

cssInterop(Image, { className: "style" });
cssInterop(Pressable, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(View, { className: "style" });
cssInterop(ActivityIndicator, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});
cssInterop(StatusBar, {
  className: {
    target: false,
    nativeStyleToProp: { backgroundColor: true },
  },
});
cssInterop(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
cssInterop(TextInput, {
  className: {
    target: "style",
    nativeStyleToProp: {
      textAlign: true,
    },
  },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: {
      color: "placeholderTextColor",
    },
  },
  selectionClassName: {
    target: false,
    nativeStyleToProp: {
      color: "selectionColor",
    },
  },
});

remapProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
remapProps(ImageBackground, {
  className: "style",
  imageClassName: "imageStyle",
});
remapProps(KeyboardAvoidingView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
remapProps(TouchableOpacity, { className: "style" });
remapProps(TouchableHighlight, { className: "style" });
remapProps(TouchableWithoutFeedback, { className: "style" });
remapProps(VirtualizedList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});

/**
 *  These are popular 3rd party libraries that we want to support out of the box.
 */
try {
  const { Svg } = require("react-native-svg");
  cssInterop(Svg, { className: "style" });
} catch {}

try {
  const { SafeAreaView } = require("react-native-safe-area-context");
  cssInterop(SafeAreaView, { className: "style" });
} catch {}
