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
import { interopFunctions } from "../render";
import {
  RemapClassNamePropsOptions,
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  InteropFunction,
} from "../../types";
import { getInteropOptions } from "./prop-mapping";
import { getGlobalStyle, getOpaqueStyle } from "../native/globals";

export function enableCSSInterop<P extends object, M>(
  component: ComponentType<P>,
  mapping: EnableCssInteropOptions<P>,
  interop: InteropFunction = defaultCSSInterop,
) {
  const map = new Map(Object.entries(mapping));

  interopFunctions.set(component, (jsx, type, props, key) => {
    const options = getInteropOptions(props, map as any, getGlobalStyle);

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
    const options = getInteropOptions(props, map as any, getOpaqueStyle);

    return jsx(type, options.remappedProps, key);
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
