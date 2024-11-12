import { useEffect } from "react";

import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import type { UseInteropState } from "../useInterop";

/**
 * Wrapper around useAnimatedStyle that allows for animations and transitions.
 * Note: This only sets the style properties that are animated or transitioned,
 *       the SharedValue is controlled via the SideEffects useEffect() in useInterop()
 * @param originalStyle
 * @param animations
 * @param transitions
 * @returns
 */
export function useAnimation(
  state: UseInteropState,
  props?: Record<string, any>,
) {
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
          target.transform ??= [];
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

        target[path] ??= {};
        target = target[path];
      }
    }

    if (state.animations) {
      for (const animation of state.animations) {
        for (const propIO of animation[1]) {
          const input = propIO[1];
          const output = propIO[2];
          const type = propIO[3];

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

  if (state.animations || state.transitions) {
    props ??= {};
    props.style = animatedStyle;
  }

  return props;
}
