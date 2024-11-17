import { createElement, useEffect } from "react";

import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import { Props } from "../types";
import type { UseInteropState } from "../useInterop";

const animatedCache = new WeakMap<
  UseInteropState["type"],
  UseInteropState["type"]
>();

export function animatedComponent(Component: UseInteropState["type"]): any {
  if (animatedCache.has(Component)) {
    return animatedCache.get(Component)!;
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

  const { default: Animated } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  const AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );
  AnimatedComponent.displayName = `Animated.${Component.displayName || Component.name || "Unknown"}`;

  function InteropAnimatedComponent(
    props: Props & { $$state: UseInteropState },
  ) {
    return createElement(AnimatedComponent, useInteropAnimatedStyle(props));
  }

  animatedCache.set(Component, InteropAnimatedComponent);
  animatedCache.set(InteropAnimatedComponent, InteropAnimatedComponent);

  return InteropAnimatedComponent;
}

export function useInteropAnimatedStyle({
  $$state: state,
  ...props
}: Props & { $$state: UseInteropState }) {
  const nextProps = { ...props };
  const originalStyle = state.props?.style as Record<string, any> | undefined;

  /**
   * Animations and transitions both generate side effects.
   */
  useEffect(() => {
    if (!state.sideEffects) return;
    const sideEffects = Object.values(state.sideEffects).flat();
    for (const sideEffect of sideEffects) {
      sideEffect?.();
    }
  }, [state.sideEffects]);

  const baseStyles = state.baseStyles;

  const animatedStyle = useAnimatedStyle(() => {
    const style: Record<string, any> = Object.assign(
      {},
      originalStyle,
      baseStyles,
    );

    /**
     * Duplicate of setValue() from src/utils/properties.ts.
     * This version runs within the UI thread
     */
    function setValue(
      paths: string | string[],
      value: string | number,
      target = style,
    ) {
      if (typeof paths === "string") {
        target[paths] = value;
        return;
      }

      for (let i = 0; i < paths.length; i++) {
        let path = paths[i];

        if (path === "transform" && i < paths.length - 1) {
          const nextPath = paths[i + 1];
          if (target.transform) {
            target.transform = [];
          }
          let existing = target.transform.find(
            (obj: Record<string, unknown>) => obj[nextPath] !== undefined,
          );
          if (existing) {
            existing[nextPath] = value;
          } else {
            target.transform.push({ [nextPath]: value });
          }
          break;
        }

        if (!target[path]) {
          target[path] = {};
        }
        target = target[path];
      }
    }

    if (state.animations) {
      for (const animation of state.animations) {
        for (const propIO of animation[1]) {
          const input = propIO[1];
          const output = propIO[2];
          const type = propIO[4];

          const interpolateFn =
            type === "color" ? interpolateColor : interpolate;

          let value = interpolateFn(animation[0].get(), input, output as any[]);

          if (type === "%") {
            value = `${value}%`;
          }

          setValue(propIO[0], value);
        }
      }
    }

    if (state.transitions) {
      for (const transition of state.transitions) {
        setValue(transition[0], transition[1].get());
      }
    }
    return style;
  }, [state.sharedValues, baseStyles, state.animations, state.transitions]);

  if (state.animations?.length || state.transitions?.length) {
    nextProps.style = animatedStyle;
  }

  return nextProps;
}
