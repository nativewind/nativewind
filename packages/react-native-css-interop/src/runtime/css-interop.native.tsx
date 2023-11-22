import {
  ComponentType,
  PropsWithChildren,
  createElement,
  forwardRef,
  useContext,
  useRef,
  useSyncExternalStore,
} from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { InteropFunction, RemapProps } from "../testing-library";
import { getNormalizeConfig } from "./native/prop-mapping";
import { interopComponents } from "./render";
import { createInteropStore } from "./native/style";
import {
  interopContext,
  InteropProvider,
  opaqueStyles,
  styleSignals,
} from "./native/globals";

export const defaultCSSInterop: InteropFunction = (
  component,
  options,
  props,
  children,
) => {
  const parent = useContext(interopContext);
  const storeRef = useRef<ReturnType<typeof createInteropStore>>();
  if (!storeRef.current) {
    storeRef.current = createInteropStore(parent, options, props);
  }

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

  const state = storeRef.current.state;

  // If the parent or a dependency changes we need to rerender
  if (
    parent !== state.parent ||
    options.dependencies.some((k, i) => props[k] !== state.dependencies[i])
  ) {
    state.rerender(parent, props);
  }

  // Merge the styled props with the props passed to the component
  props = {
    ...props,
    ...state.props,
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

  // Depending on the meta, we may be required to surround the component in other components (like VariableProvider)
  let createElementParams: Parameters<typeof createElement> = [
    state.isAnimated ? createAnimatedComponent(component) : component,
    props,
    children,
  ];

  /**
   * This code shouldn't be needed, but inline shared values are not working properly.
   * https://github.com/software-mansion/react-native-reanimated/issues/5296
   */
  if (!process.env.NATIVEWIND_INLINE_ANIMATION) {
    if (state.isAnimated) {
      props.__component = createElementParams[0];
      createElementParams[0] = CSSInteropAnimationWrapper;
      createElementParams;
    }
  }

  if (state.context) {
    createElementParams = [
      InteropProvider,
      {
        value: state.context,
      },
      createElement(...createElementParams),
    ] as any;
  }

  return createElementParams;
};

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

  return <Component {...props} style={style} />;
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
    for (const entry of config) {
      const key = entry[0];
      const sourceProp = entry[1];
      let rawStyles = [];

      const source = props?.[sourceProp];

      if (typeof source !== "string") continue;
      delete props[sourceProp];

      for (const className of source.split(/\s+/)) {
        const signal = styleSignals.get(className);

        if (signal !== undefined) {
          const style = {};
          opaqueStyles.set(style, signal.get());
          rawStyles.push(style);
        }
      }

      if (rawStyles.length !== 0) {
        const existingStyle = props[key];

        if (Array.isArray(existingStyle)) {
          rawStyles.push(...existingStyle);
        } else if (existingStyle) {
          rawStyles.push(existingStyle);
        }

        (props as any)[key] = rawStyles.length === 1 ? rawStyles[0] : rawStyles;
      }
    }

    (props as any).ref = ref;

    return createElement(component as any, props, props.children);
  };

  interopComponents.set(component as any, {
    type: forwardRef(render),
    check: () => true,
    createElementWithInterop(props, children) {
      return render({ ...props, children }, null);
    },
  });

  return;
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
