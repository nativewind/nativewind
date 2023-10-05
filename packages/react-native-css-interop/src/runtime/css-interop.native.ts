import { createElement } from "react";

import { InteropFunction } from "../testing-library";
import { reactGlobal } from "./signals";
import { Pressable, View } from "react-native";
import { InheritanceProvider } from "./native/inheritance";
import { useInteropComputed } from "./native/interop";

export const defaultCSSInterop: InteropFunction = (
  component,
  options,
  props,
  children,
) => {
  reactGlobal.isInComponent = true;
  reactGlobal.currentStore = null;

  const effect = useInteropComputed(props, options);

  props = {
    ...props,
    ...effect.styledProps,
  };

  for (const source of options.sources) {
    delete props[source];
  }

  // View doesn't support the interaction props, so force the component to be a Pressable (which accepts ViewProps)
  if (effect.convertToPressable) {
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

  if (effect.animationInteropKey) {
    props = Object.assign(props, {
      key: effect.animationInteropKey,
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

  if (effect.contextValue) {
    return [
      InheritanceProvider,
      {
        value: effect.contextValue,
      },
      createElement(...createElementParams),
    ] as any;
  } else {
    return createElementParams;
  }
};
