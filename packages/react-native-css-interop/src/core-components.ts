import { ComponentType } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
  VirtualizedList,
  Image,
} from "react-native";

import { defaultCSSInterop } from "./runtime/css-interop";
import { interopFunctions } from "./runtime/render";
import {
  getInteropFunctionOptions,
  getRemappedProps,
} from "./runtime/render-options";
import type {
  RemapProps,
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  InteropFunction,
} from "./types";

export function cssInterop<P extends object, M>(
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

export function remapProps<P, M>(
  component: ComponentType<P>,
  options: RemapProps<P> & M,
) {
  const map = new Map(Object.entries(options));

  interopFunctions.set(component, (jsx, type, props, key) => {
    return jsx(type, getRemappedProps(props, map as any), key);
  });

  return component as ComponentTypeWithMapping<P, M>;
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
