import { createElement } from "react";

import { InteropFunction } from "../testing-library";
import { reactGlobal } from "./signals";
import { Pressable, View } from "react-native";
import { InheritanceProvider } from "./native/inheritance";
import { useInteropEffect } from "./native/interop-effect";

export const defaultCSSInterop: InteropFunction = (
  component,
  options,
  props,
  children,
) => {
  reactGlobal.isInComponent = true;
  reactGlobal.currentStore = null;

  const {
    contextValue,
    convertToPressable,
    styledProps,
    animationInteropKey,
    effect,
  } = useInteropEffect(props, options);

  props = {
    ...props,
    ...styledProps,
  };

  for (const source of options.sources) {
    delete props[source];
  }

  // View doesn't support the interaction props, so force the component to be a Pressable (which accepts ViewProps)
  if (convertToPressable) {
    Object.assign(props, { ___pressable: true });
    if ((component as any) === View) {
      component = Pressable;
    }
  }

  // Depending on the meta, we may be required to surround the component in other components (like VariableProvider)
  let createElementParams: Parameters<typeof createElement> = [
    component,
    props,
    children,
  ];

  if (animationInteropKey) {
    props = Object.assign(props, {
      key: animationInteropKey,
      __component: component,
      __store: effect,
    });

    createElementParams = [
      require("./native/animations").AnimationInterop,
      props,
      children,
    ];
  }

  reactGlobal.isInComponent = false;

  if (contextValue) {
    return [
      InheritanceProvider,
      {
        value: contextValue,
      },
      createElement(...createElementParams),
    ] as any;
  } else {
    return createElementParams;
  }
};
