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

import { defaultCSSInterop } from "../css-interop";
import {
  InteropFunction,
  JSXFunction,
  createPropRemapper,
  interopMapping,
  propReMapping,
} from "../render";
import { CssInteropPropMapping, CssInteropProps } from "../../types";

export function enableCSSInterop<
  P extends object,
  M extends CssInteropPropMapping<P>,
>(
  component: ComponentType<P>,
  mapping?: M & Partial<Record<keyof P, unknown>>,
  styleProp = "style",
  interop: InteropFunction = defaultCSSInterop,
): ComponentType<P & CssInteropProps<M>> {
  if (mapping) {
    enableClassNameResolution(component, mapping);
  }
  interopMapping.set(component, interop);
  return component;
}

export function enableClassNameResolution<
  P extends object,
  M extends CssInteropPropMapping<P>,
>(
  component: ComponentType<P>,
  mapping: M & Partial<Record<keyof P, unknown>>,
): ComponentType<P & CssInteropProps<M>> {
  if (mapping) {
    propReMapping.set(component, createPropRemapper(mapping));
  }
  return component;
}

/**
 * Components w/ CSS Interop
 */
enableCSSInterop(ActivityIndicator, { style: "className" });
enableCSSInterop(Image, { style: "className" });
enableCSSInterop(Pressable, { style: "className" });
enableCSSInterop(Text, { style: "className" });
enableCSSInterop(View, { style: "className" });
enableCSSInterop(
  StatusBar,
  {
    barStyle: "barClassName",
  },
  "barStyle",
);

/**
 * Compones w/ className remapping
 */
enableClassNameResolution(FlatList, {
  style: "className",
  ListFooterComponentStyle: "ListFooterComponentClassName",
  ListHeaderComponentStyle: "ListHeaderComponentClassName",
  columnWrapperStyle: "columnWrapperClassName",
  contentContainerStyle: "contentContainerClassName",
  indicatorStyle: "indicatorClassName",
});
enableClassNameResolution(ImageBackground, {
  style: "className",
  imageStyle: "imageClassName",
});
enableClassNameResolution(KeyboardAvoidingView, {
  style: "className",
  contentContainerStyle: "contentContainerClassName",
});
enableClassNameResolution(Modal, {
  style: "className",
  presentationStyle: "presentationClassName",
});
enableClassNameResolution(ScrollView, {
  style: "className",
  contentContainerStyle: "contentContainerClassName",
  indicatorStyle: "indicatorClassName",
});
enableClassNameResolution(VirtualizedList, {
  style: "className",
  ListFooterComponentStyle: "ListFooterComponentClassName",
  ListHeaderComponentStyle: "ListHeaderComponentClassName",
  contentContainerStyle: "contentContainerClassName",
  indicatorStyle: "indicatorClassName",
});
