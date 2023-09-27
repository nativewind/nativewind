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
  View,
  VirtualizedList,
  Image,
} from "react-native";

import { defaultCSSInterop } from "./runtime/css-interop";
import { InteropTypeCheck, interopComponents, render } from "./runtime/render";
import type {
  RemapProps,
  ComponentTypeWithMapping,
  EnableCssInteropOptions,
  InteropFunction,
} from "./types";
import { getNormalizeConfig } from "./runtime/native/prop-mapping";
import { getGlobalStyle } from "./runtime/native/stylesheet";
import { opaqueStyles, styleMetaMap } from "./runtime/native/misc";

export function unstable_styled<P extends object, M>(
  component: ComponentType<P>,
  mapping?: EnableCssInteropOptions<P> & M,
  interop: InteropFunction = defaultCSSInterop,
) {
  if (mapping) {
    globalCssInterop(component, mapping, interop);
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

export function globalCssInterop<T extends {}, M>(
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

export function remapProps<P, M>(
  component: ComponentType<P>,
  mapping: RemapProps<P> & M,
) {
  const { config } = getNormalizeConfig(mapping);

  let render: any = <P extends Record<string, unknown>>(
    { ...props }: PropsWithChildren<P>,
    ref: unknown,
  ) => {
    for (const [key, { sources }] of config) {
      let rawStyles = [];

      for (const sourceProp of sources) {
        const source = props?.[sourceProp];

        if (typeof source !== "string") continue;
        delete props[sourceProp];

        for (const className of source.split(/\s+/)) {
          const style = getGlobalStyle(className);

          if (style !== undefined) {
            const opaqueStyle = {};
            opaqueStyles.set(opaqueStyle, style);
            rawStyles.push(opaqueStyle);
          }
        }
      }

      const existingStyle = props[key];

      if (Array.isArray(existingStyle)) {
        rawStyles.push(...existingStyle);
      } else if (existingStyle) {
        rawStyles.push(existingStyle);
      }

      if (rawStyles.length !== 0) {
        (props as any)[key] = rawStyles.length === 1 ? rawStyles[0] : rawStyles;
      }
    }

    (props as any).ref = ref;

    return createElement(component as any, props, props.children);
  };

  interopComponents.set(component, {
    type: forwardRef(render),
    check: () => true,
  });
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
