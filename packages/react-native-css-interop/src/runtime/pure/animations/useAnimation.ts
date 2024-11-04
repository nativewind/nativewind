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

  const animatedStyle = useAnimatedStyle(() => {
    const style: Record<string, any> = { ...originalStyle };
    // const seenProperties = new Set<string>();

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

    // if (groupedTransitions) {
    //   for (const transition of Object.values(groupedTransitions).flat()) {
    //     if (!transition) {
    //       continue;
    //     }
    //     if (seenProperties.has(transition[0])) {
    //       continue;
    //     }

    //     seenProperties.add(transition[0]);

    //     style[transition[0]] = transition[1].value;
    //   }
    // }

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

    return style;
  }, [groupedAnimations, groupedTransitions, originalStyle]);

  return state.animations || state.transitions
    ? { ...state.props, style: animatedStyle }
    : props;
}
