import { useEffect, useMemo } from "react";

import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import type { ComponentReducerState } from "../state/component";

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
  state: ComponentReducerState,
  props?: Record<string, any>,
) {
  const groupedAnimations = state.animations;
  const groupedTransitions = state.transitions;
  const originalStyle = state.props?.style as Record<string, any> | undefined;

  /**
   * Animations and transitions are side effects.
   */
  useEffect(() => {
    if (!state.sideEffects) return;
    const sideEffects = Object.values(state.sideEffects).flat();
    for (const sideEffect of sideEffects) {
      sideEffect?.();
    }
  }, [state.sideEffects]);

  const a = useMemo(() => {
    return [[groupedTransitions?.["0"]?.get("width")]];
  }, [groupedTransitions]);

  const animatedStyle = useAnimatedStyle(() => {
    const style: Record<string, any> = { ...originalStyle };

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

    if (groupedAnimations) {
      for (const animationIO of Object.values(groupedAnimations).flat()) {
        if (!animationIO) {
          continue;
        }

        for (const propIO of animationIO[1]) {
          const input = propIO[1];
          const output = propIO[2];
          const type = propIO[3];

          const interpolateFn =
            type === "color" ? interpolateColor : interpolate;

          let value = interpolateFn(
            animationIO[0].value,
            input,
            output as any[],
          );

          if (type === "%") {
            value = `${value}%`;
          }

          setValue(propIO[0], value);
        }
      }
    }

    if (groupedTransitions) {
      for (const transitions of Object.values(groupedTransitions).flat()) {
        if (!transitions) {
          continue;
        }

        for (const transition of transitions) {
          if (!transition[1]) {
            continue;
          }

          setValue(transition[0], transition[1].value);
        }
      }
    }

    return style;
  }, [groupedAnimations, groupedTransitions, originalStyle, a]);

  return state.animations || state.transitions
    ? { ...state.props, style: animatedStyle }
    : props;
}
