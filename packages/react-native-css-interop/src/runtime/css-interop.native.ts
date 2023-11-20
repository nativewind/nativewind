import {
  ComponentType,
  PropsWithChildren,
  createElement,
  forwardRef,
} from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { InteropFunction, RemapProps } from "../testing-library";
import { reactGlobal } from "./signals";
import { InheritanceProvider } from "./native/inheritance";
import { useInteropComputed } from "./native/interop";
import { getNormalizeConfig } from "./native/prop-mapping";
import { interopComponents } from "./render";
import { styleSignals } from "./native/style";

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
    ...effect.props,
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
    effect.isAnimated ? createAnimatedComponent(component) : component,
    props,
    children,
  ];

  /**
   * This code shouldn't be needed, but inline shared values are not working properly.
   * https://github.com/software-mansion/react-native-reanimated/issues/5296
   */
  if (!process.env.NATIVEWIND_INLINE_ANIMATION) {
    if (effect.isAnimated) {
      props.style = useAnimatedStyle(() => {
        const style: any = {};
        const entries = Object.entries(effect.props.style);

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
      }, [effect.props.style]);
    } else {
      useAnimatedStyle(() => ({}), [effect]);
    }
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

export function remapProps<P, M>(
  component: ComponentType<P>,
  mapping: RemapProps<P> & M,
) {
  const { config } = getNormalizeConfig(mapping);

  let render: any = <P extends Record<string, unknown>>(
    { ...props }: PropsWithChildren<P>,
    ref: unknown,
  ) => {
    for (const [key, sources] of config) {
      let rawStyles = [];

      for (const sourceProp of sources) {
        const source = props?.[sourceProp];

        if (typeof source !== "string") continue;
        delete props[sourceProp];

        for (const className of source.split(/\s+/)) {
          const signal = styleSignals.get(className);

          if (signal !== undefined) {
            const style = {};
            // opaqueStyles.set(style, {
            //   reducer(acc) {
            //     return signal?.reducer(acc, true) ?? acc;
            //   },
            // });
            rawStyles.push(style);
          }
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
