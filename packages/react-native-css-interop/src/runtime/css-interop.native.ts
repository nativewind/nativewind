import { ComponentType, forwardRef, useEffect, useReducer } from "react";
import { View, Pressable } from "react-native";

import { DevHotReloadSubscription } from "../shared";
import { ContainerContext } from "./native/misc";
import { StyleSheet } from "./native/stylesheet";
import { useStyledProps } from "./native/use-computed-props";
import type {
  InteropFunction,
  InteropFunctionOptions,
  JSXFunction,
} from "../types";
import { VariableContext } from "./native/variables";

export const defaultCSSInterop: InteropFunction = (
  jsx,
  type,
  props,
  key,
  options,
) => {
  if (!options.useWrapper) {
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

  const { styledProps, meta } = useStyledProps($props, jsx, options, rerender);

  const props = {
    ...$props,
    ...styledProps,
  };

  // View doesn't support the interaction props, so switch to a Pressable (which accepts ViewProps)
  if (meta.convertToPressable && !props.$$pressable) {
    props.$$pressable = true;
    if (component === View) {
      component = Pressable as ComponentType<unknown>;
    }
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

export const useRerender = () => useReducer(rerenderReducer, 0)[1];
const rerenderReducer = (accumulator: number) => accumulator + 1;
