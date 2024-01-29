import {
  ComponentType,
  createElement,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { createInteropStore } from "./style";
import type { InteropFunction } from "../../types";
import { interopContext, InteropProvider } from "./globals";
import { getTestAttributeValue } from "./conditions";

export type InteropComponent = {
  type: ComponentType<any>;
  check: (props: Record<string, any>) => boolean;
};

export const defaultCSSInterop: InteropFunction = (
  component,
  options,
  originalProps,
  children,
) => {
  let props: Record<string, any> = originalProps
    ? { ...originalProps, children }
    : { children };
  const parent = useContext(interopContext);
  const storeRef = useRef<ReturnType<typeof createInteropStore>>();
  if (!storeRef.current) {
    storeRef.current = createInteropStore(parent, options, props);
  }
  const state = storeRef.current.state!;

  /**
   * I think there is a way to rewrite this with useReducer, but I'm not sure how to do it.
   * If a signal changes we need to render a different component.
   * But you cannot do a state update while rendering, but useSyncExternalStore
   * allows you to work around this restriction
   */
  useSyncExternalStore(
    storeRef.current.subscribe,
    storeRef.current.snapshot,
    storeRef.current.snapshot,
  );

  // If the parent or a dependency changes we need to rerender
  if (
    parent !== state.parent ||
    options.dependencies.some((k, i) => props[k] !== state.dependencies[i]) ||
    storeRef.current.state.attrDependencies.some((condition) => {
      return getTestAttributeValue(props, condition) !== condition.previous;
    })
  ) {
    state.rerender(parent, props);
  }

  // Merge the styled props with the props passed to the component
  props = {
    ...state.props,
    ...props,
  };

  // Delete any props that were used as sources
  for (const source of options.sources) {
    delete props[source];
  }

  // View doesn't support the interaction props, so force the component to be a Pressable (which accepts ViewProps)
  if (state.convertToPressable) {
    if (component === View) {
      props.___pressable = true;
      component = Pressable;
    }
  }

  if (state.isAnimated) {
    const $component = createAnimatedComponent(component);
    props.__component = $component;
    component = CSSInteropAnimationWrapper;
  }

  if (state.context) {
    children = createElement(component, props, children);
    props = { value: state.context };
    component = InteropProvider;
  }

  return createElement(component, props, children);
};

/**
 * This code shouldn't be needed, but inline shared values are not working properly.
 * https://github.com/software-mansion/react-native-reanimated/issues/5296
 */
export function CSSInteropAnimationWrapper({
  __component: Component,
  __sharedValues,
  ...props
}: any) {
  const style = useAnimatedStyle(() => {
    const style: any = {};
    const entries = Object.entries(props.style);

    for (const [key, value] of entries as any) {
      if (typeof value === "object" && "value" in value) {
        style[key] = value.value;
      } else if (key === "transform") {
        style.transform = value.map((v: any) => {
          const [key, value] = Object.entries(v)[0] as any;

          if (typeof value === "object" && "value" in value) {
            return { [key]: value.value };
          } else {
            return { [key]: value };
          }
        });
      } else {
        style[key] = value;
      }
    }

    return style;
  }, [props.style]);

  return createElement(Component, { ...props, style }, props.children);
}

const animatedCache = new Map<
  ComponentType<any> | string,
  ComponentType<any>
>();
export function createAnimatedComponent(
  Component: ComponentType<any>,
): ComponentType<any> {
  if (animatedCache.has(Component)) {
    return animatedCache.get(Component)!;
  } else if (Component.displayName?.startsWith("AnimatedComponent")) {
    return Component;
  }

  if (
    !(
      typeof Component !== "function" ||
      (Component.prototype && Component.prototype.isReactComponent)
    )
  ) {
    throw new Error(
      `Looks like you're passing an animation style to a function component \`${Component.name}\`. Please wrap your function component with \`React.forwardRef()\` or use a class component instead.`,
    );
  }

  const AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );

  animatedCache.set(Component, AnimatedComponent);

  return AnimatedComponent;
}
