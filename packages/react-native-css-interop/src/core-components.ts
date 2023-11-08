import { ComponentType, createElement, forwardRef } from "react";
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
import { cssInterop, render } from "./runtime/render";
import type {
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  InteropFunction,
} from "./types";
import { remapProps } from "./runtime/css-interop";
import { defaultInteropRef } from "./runtime/globals";

defaultInteropRef.current = defaultCSSInterop;

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
});
cssInterop(TouchableOpacity, { className: "style" });
cssInterop(TouchableHighlight, { className: "style" });
cssInterop(TouchableWithoutFeedback, { className: "style" });

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
