import type { ComponentType } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  VirtualizedList,
  Image,
} from "react-native";

import { defaultCSSInterop } from "./css-interop";
import { getInteropFunctionOptions, getRemappedProps } from "./render-options";
import type { BasicInteropFunction, JSXFunction } from "../types";
import type {
  RemapClassNamePropsOptions,
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  InteropFunction,
} from "../types";

const interopFunctions = new WeakMap<
  ComponentType<any>,
  BasicInteropFunction
>();

export function render<P>(
  jsx: JSXFunction<P>,
  type: any,
  props: P,
  key?: string,
  cssInterop?: BasicInteropFunction,
) {
  if (
    __DEV__ &&
    typeof type === "string" &&
    type === "react-native-css-interop-jsx-pragma-check"
  ) {
    return true;
  }

  if (typeof type === "string") {
    return jsx(type, props, key);
  }

  cssInterop ??= interopFunctions.get(type);
  return cssInterop ? cssInterop(jsx, type, props, key) : jsx(type, props, key);
}

export function enableCSSInterop<P extends object, M>(
  component: ComponentType<P>,
  mapping: EnableCssInteropOptions<P>,
  interop: InteropFunction = defaultCSSInterop,
) {
  const map = new Map(Object.entries(mapping));

  interopFunctions.set(component, (jsx, type, props, key) => {
    const options = getInteropFunctionOptions(props, map as any);

    return interop<typeof props>(
      jsx,
      type,
      options.remappedProps,
      key,
      options,
    );
  });

  return component as ComponentTypeWithMapping<P, M>;
}

export function remapClassNameProps<P, M>(
  component: ComponentType<P>,
  options: RemapClassNamePropsOptions<P> & M,
) {
  const map = new Map(Object.entries(options));

  interopFunctions.set(component, (jsx, type, props, key) => {
    return jsx(type, getRemappedProps(props, map as any), key);
  });

  return component as ComponentTypeWithMapping<P, M>;
}

enableCSSInterop(Image, { className: "style" });
enableCSSInterop(Pressable, { className: "style" });
enableCSSInterop(Text, { className: "style" });
enableCSSInterop(View, { className: "style" });
enableCSSInterop(ActivityIndicator, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});
enableCSSInterop(StatusBar, {
  className: {
    target: false,
    nativeStyleToProp: { backgroundColor: true },
  },
});

remapClassNameProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
remapClassNameProps(ImageBackground, {
  className: "style",
  imageClassName: "imageStyle",
});
remapClassNameProps(KeyboardAvoidingView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
remapClassNameProps(Modal, {
  className: "style",
  presentationClassName: "presentationStyle",
});
remapClassNameProps(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
remapClassNameProps(VirtualizedList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
