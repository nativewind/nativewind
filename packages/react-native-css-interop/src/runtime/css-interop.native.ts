import { ComponentType, forwardRef, useEffect } from "react";
import { View, Pressable } from "react-native";

import { DevHotReloadSubscription } from "../shared";
import { ContainerContext } from "./native/globals";
import { StyleSheet, useRerender, VariableContext } from "./native/stylesheet";
import { useComputedProps } from "./native/use-computed-props";
import type {
  InteropFunction,
  InteropFunctionOptions,
  JSXFunction,
} from "../types";

export const defaultCSSInterop: InteropFunction = (
  jsx,
  type,
  props,
  key,
  options,
) => {
  if (!options.hasMeta) {
    return jsx(type, props, key);
  }

  return jsx(
    CSSInteropWrapper,
    {
      ...props,
      __component: type,
      __jsx: jsx,
      __options: options,
    },
    key,
  );
};

type CSSInteropWrapperProps<P> = {
  __component: ComponentType<P>;
  __jsx: JSXFunction<P>;
  __options: InteropFunctionOptions<P>;
} & P;

export const CSSInteropWrapper = forwardRef(function CSSInteropWrapper(
  {
    __component: component,
    __jsx: jsx,
    __options: options,
    ...$props
  }: CSSInteropWrapperProps<Record<string, any>>,
  ref,
) {
  const rerender = useRerender();

  /**
   * If the development environment is enabled, we should rerender all components if the StyleSheet updates.
   * This is because things like :root variables may have updated.
   */
  if (__DEV__) {
    useEffect(() => StyleSheet[DevHotReloadSubscription](rerender), []);
  }

  const { props, meta } = useComputedProps($props, options, rerender);

  // View doesn't support the interaction props, so switch to a Pressable (which accepts ViewProps)
  if (component === View && meta.convertToPressable) {
    component = Pressable as ComponentType<unknown>;
  }

  // Depending on the meta, we may be required to surround the component in other components (like VariableProvider)
  let finalComponent;

  // We call `jsx` directly so we can bypass the polyfill render method
  if (meta.animationInteropKey) {
    finalComponent = jsx(
      require("./native/animations").AnimationInterop,
      {
        ...props,
        __component: component,
        __meta: meta,
      },
      meta.animationInteropKey,
    );
  } else {
    finalComponent = jsx(component, props, "react-native-css-interop");
  }

  if (meta.hasInlineVariables) {
    finalComponent = jsx(
      VariableContext.Provider,
      { value: meta.variables, children: [finalComponent] },
      "variable",
    );
  }

  if (meta.hasInlineContainers) {
    finalComponent = jsx(
      ContainerContext.Provider,
      { value: meta.containers, children: [finalComponent] },
      "container",
    );
  }

  return finalComponent;
});
