import { ComponentType, forwardRef } from "react";
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

  return forwardRef(function (props: P, ref) {
    (props as any).ref = ref;
    const options = getInteropFunctionOptions(props, map as any);

    return interop<typeof props>(
      jsx,
      component,
      options.remappedProps,
      "",
      options,
    );
  });
}

export function globalCssInterop<P extends object, M>(
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

globalCssInterop(Image, { className: "style" });
globalCssInterop(Pressable, { className: "style" });
globalCssInterop(Text, { className: "style" });
globalCssInterop(View, { className: "style" });
globalCssInterop(ActivityIndicator, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});
globalCssInterop(StatusBar, {
  className: {
    target: false,
    nativeStyleToProp: { backgroundColor: true },
  },
});
globalCssInterop(ScrollView, {
  className: "style",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
globalCssInterop(TextInput, {
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
remapProps(VirtualizedList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});
