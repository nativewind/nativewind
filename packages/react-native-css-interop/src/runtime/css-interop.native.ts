import { createElement } from "react";

import { useStyledProps } from "./native/use-computed-props";
import { ComponentContextProvider } from "./native/proxy";
import { InteropFunction } from "../testing-library";
import { reactGlobal } from "./signals";
import { Pressable, View } from "react-native";

export const defaultCSSInterop: InteropFunction = (
  component,
  options,
  props,
  children,
) => {
  reactGlobal.isInComponent = true;
  reactGlobal.currentStore = null;

  const { store } = useStyledProps(props, options);
  const { meta, styledProps } = store.snapshot;

  props = {
    ...props,
    ...styledProps,
  };

  for (const source of options.sources) {
    delete props[source];
  }

  // View doesn't support the interaction props, so force the component to be a Pressable (which accepts ViewProps)
  if (meta.convertToPressable) {
    Object.assign(props, { ___pressable: true });
    if ((component as any) === View) {
      component = Pressable;
    }
  }

  // Depending on the meta, we may be required to surround the component in other components (like VariableProvider)
  let finalComponent;

  if (meta.animationInteropKey) {
    props = Object.assign(props, {
      key: meta.animationInteropKey,
      __component: component,
      __store: store,
    });

    finalComponent = createElement(
      require("./native/animations").AnimationInterop,
      props,
      children,
    );
  } else {
    finalComponent = createElement(component, props, children);
  }

  reactGlobal.isInComponent = false;

  return [
    ComponentContextProvider,
    {
      value: store.context,
    },
    finalComponent,
  ] as any;
};
