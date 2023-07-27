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
  createPropMapper as createPropMapper,
  interopMapping,
  propMapping,
} from "../render";
import { CssInteropPropMapping, CssInteropProps } from "../../types";

export function enableCSSInterop<P extends object, M>(
  component: ComponentType<P>,
  mapping: CssInteropPropMapping<P>,
  interop = defaultCSSInterop,
): ComponentType<P & CssInteropProps<M>> {
  const mappingMap = new Map(Object.entries(mapping));
  interopMapping.set(component, (jsx, type, props, key) => {
    return interop(jsx, type, props, key, mappingMap);
  });

  return component as ComponentType<P & CssInteropProps<M>>;
}

export function bindProps<P extends object, M>(
  component: ComponentType<P>,
  mapping: CssInteropPropMapping<P> & M,
): ComponentType<P & CssInteropProps<M>> {
  propMapping.set(component, createPropMapper(mapping));
  return component as ComponentType<P & CssInteropProps<M>>;
}

enableCSSInterop(ActivityIndicator, { className: "style" });
enableCSSInterop(Image, { className: "style" });
enableCSSInterop(Pressable, { className: "style" });
enableCSSInterop(Text, { className: "style" });
enableCSSInterop(View, { className: "style" });
enableCSSInterop(StatusBar, { barClassName: "barStyle" });

bindProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
bindProps(ImageBackground, {
  className: "style",
  imageClassName: "imageStyle",
});
bindProps(KeyboardAvoidingView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
});
bindProps(Modal, {
  className: "style",
  presentationClassName: "presentationStyle",
});
bindProps(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
bindProps(VirtualizedList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
