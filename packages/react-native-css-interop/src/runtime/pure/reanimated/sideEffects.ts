import { RuntimeFunction } from "test";

import { VariableContextValue } from "../contexts";
import type { Declarations } from "../declarations";
import { animationFamily, rootVariables, universalVariables } from "../globals";
import { ResolveOptions, resolveValue } from "../resolvers";
import type { ConfigReducerState } from "../state/config";
import type { StateWithStyles } from "../styles";
import type { SideEffectTrigger, StyleValueDescriptor } from "../types";
import { getValue } from "../utils/properties";
import type {
  AnimationAttributes,
  AnimationEasing,
  AnimationMutable,
  EasingFunction,
  ReanimatedMutable,
} from "./types";

/**
 * Animations are all linked. If any animation property changes, all animations
 * will restart.
 */
export function buildAnimationSideEffects(
  next: Declarations,
  previous: Declarations | undefined,
  inheritedVariables: VariableContextValue,
) {
  if (!next.animation) return next;

  let variables: Record<string, StyleValueDescriptor>;

  const {
    n: names = defaultAnimation.n,
    du: durations = defaultAnimation.du,
    de: delays = defaultAnimation.du,
    e: baseEasingFuncs = defaultAnimation.e,
    i: iterationList = defaultAnimation.i,
  } = next.animation.reduce((acc, current) => {
    if (current.length === 1) {
      return Object.assign(acc, current[0]);
    }

    if (next.variables) {
      variables = Object.fromEntries(next.variables.flat(1));
    }

    const shorthandAttributes = getAnimationAttributes(
      current[1],
      next,
      variables,
      inheritedVariables,
    );

    // Make sure more specific attributes override the shorthand
    return Object.assign(acc, shorthandAttributes, current[0]);
  }, {} as Partial<AnimationAttributes>);

  if (!names.length) return next;

  try {
    const { makeMutable, cancelAnimation } = require("react-native-reanimated");

    let sideEffects: SideEffectTrigger[] = [];
    const sharedValues: Map<string, AnimationMutable> = new Map();
    const previousSharedValues = previous?.sharedValues;

    let previousNames: Set<string> | undefined;
    if (previous?.sharedValues) {
      previousNames = new Set(previous.sharedValues.keys());
    }

    for (let index = 0; index < names.length; index++) {
      const name = names[index];

      // If any animation is set to none, we should cancel all animations
      if (name === "none") {
        continue;
      }

      let mutable = sharedValues.get(name);
      if (!mutable) {
        mutable = makeMutable(0) as AnimationMutable;
        sharedValues.set(name, mutable);
      }

      const animation = next.get(animationFamily(name));
      if (!animation) {
        continue;
      }

      /**
       * Set the default style for the animation
       * These values are used when the animation is removed or missing
       * values
       */
      let start = 0;
      const delay = delays[index % delays.length];
      const duration = durations[index % durations.length];
      const baseEasingFunction =
        baseEasingFuncs[index % baseEasingFuncs.length];
      let iterations = iterationList[index % iterationList.length];

      /**
       * When delay < 0, the animation immediately starts and jumps ahead by the delayed amount
       */
      if (delay < 0) {
        const absDelay = Math.abs(delay);
        const iterationsPerformed = Math.floor(absDelay / duration);
        iterations -= iterationsPerformed;

        start =
          iterations > 1
            ? // If we are still repeating, work out the new starting progress
              (absDelay % duration) / duration
            : // Else we have finished
              1;
      }

      sideEffects.push(() => {
        // Reset the animation to the starting value
        mutable.value = start;
        // Start the animation
        mutable.value = getAnimationTiming(
          mutable,
          0,
          0,
          duration,
          iterations === -1 ? Infinity : iterations,
          false,
          true,
          animation.animation[1],
          baseEasingFunction,
        );
      });
    }

    /**
     * When cancelling animations, we don't need to cancel animations from this
     * render, as they haven't started yet. We only need to cancel animations
     * from the previous render(s).
     */
    if (previousNames && previousNames.size) {
      // Cancel any animations that are no longer present
      sideEffects.push(
        ...Array.from(previousNames, (name) => {
          const mutable = previousSharedValues!.get(name)!;
          previousSharedValues?.delete(name);
          return () => {
            mutable.value = 0;
            cancelAnimation(mutable);
          };
        }),
      );
    }

    next.sideEffects = sideEffects;
    next.sharedValues = sharedValues;

    return next;
  } catch {
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "[CssInterop] Attempted to use animation without react-native-reanimated installed",
      );
    }

    return next;
  }
}

export function getAnimationTiming(
  mutable: AnimationMutable,
  index: number,
  progress: number,
  totalDuration: number,
  iterations: number,
  repeat = false,
  forwards = true,
  steps: AnimationEasing[] = [0, 1],
  easing: EasingFunction = "linear",
) {
  const { withTiming, Easing } = require("react-native-reanimated");

  const step = steps[index];
  const target = typeof step === "number" ? step : step[0];
  const duration = totalDuration * target - progress;

  if (typeof step !== "number" && target === 0) {
    easing = step[1];
  }

  return withTiming(
    target,
    { duration, easing: getEasing(easing, Easing) },
    () => {
      if (typeof step !== "number") {
        easing = step[1];
      }

      const nextIndex = forwards ? index + 1 : index - 1;

      if (nextIndex > -1 && nextIndex < steps.length) {
        progress += forwards ? duration : -duration;

        mutable.value = getAnimationTiming(
          mutable,
          nextIndex,
          progress,
          totalDuration,
          iterations,
          repeat,
          forwards,
          steps,
          easing,
        );
      } else if (iterations > 1) {
        if (repeat) forwards = !forwards;

        const startingIndex = forwards ? 0 : steps.length - 1;

        const staringProgress = forwards ? 0 : 1;

        mutable.value = getAnimationTiming(
          mutable,
          startingIndex,
          staringProgress,
          totalDuration,
          iterations - 1,
          repeat,
          forwards,
          steps,
          easing,
        );
      }
    },
  );
}

export function getEasing(
  timingFunction: EasingFunction | undefined,
  Easing: (typeof import("react-native-reanimated"))["Easing"],
) {
  if (!timingFunction) return Easing.linear;

  if (typeof timingFunction === "string") {
    switch (timingFunction) {
      case "ease":
        return Easing.ease;
      case "ease-in":
        return Easing.in(Easing.quad);
      case "ease-out":
        return Easing.out(Easing.quad);
      case "ease-in-out":
        return Easing.inOut(Easing.quad);
      case "linear":
        return Easing.linear;
      default:
        timingFunction satisfies never;
    }
  } else {
    switch (timingFunction.type) {
      case "cubic-bezier":
        return Easing.bezier(
          timingFunction.x1,
          timingFunction.y1,
          timingFunction.x2,
          timingFunction.y2,
        );
      case "steps":
        return Easing.linear;
      default:
        timingFunction satisfies never;
    }
  }
}

const defaultAnimation: Required<AnimationAttributes> = {
  n: ["none"],
  di: ["normal"],
  de: [0],
  f: ["none"],
  i: [1],
  e: ["linear"],
  p: ["running"],
  du: [0],
  t: [],
};

export function getTransitionSideEffect(
  next: StateWithStyles,
  previous: ConfigReducerState,
  propPath: string | string[],
): ((value: any) => () => void) | undefined {
  let prop = Array.isArray(propPath) ? propPath[propPath.length - 1] : propPath;
  if (prop.startsWith("^")) {
    prop = prop.slice(1);
  }

  const transition = next.declarations?.transition;

  if (!transition?.p) {
    return;
  }

  const index = transition.p.indexOf(prop);

  if (index === -1) {
    return;
  }

  let transitions = previous.styles?.transitions;
  if (!transitions) {
    transitions = new Map();
  } else {
    transitions = new Map(transitions);
  }

  next.styles.transitions = transitions;

  const {
    makeMutable,
    withTiming,
    withDelay,
    Easing,
  } = require("react-native-reanimated");

  let sharedValue = transitions.get(propPath);
  if (!sharedValue) {
    sharedValue = makeMutable() as ReanimatedMutable<any>;
    transitions.set(propPath, sharedValue);
  }

  return (value: any) => {
    return () => {
      const previousValue = sharedValue.value;

      // This is the first render, never transition
      if (previousValue === undefined && previous === undefined) {
        sharedValue.value = value;
        return;
      }

      // This is not the first render, just the first time this prop is set
      // So we need to transition from the default value
      if (previousValue === undefined) {
        sharedValue.value = getValue(
          previous,
          previous.styles?.props || {},
          propPath,
        );
      }

      sharedValue.value = withDelay(
        transition.de?.[index % transition.de.length] ?? 0,
        withTiming(value, {
          duration: transition.du?.[index % transition.du.length] ?? 0,
          easing: getEasing(
            transition.e?.[index % transition.e.length],
            Easing,
          ),
        }),
      );
    };
  };
}

function getAnimationAttributes(
  func: RuntimeFunction,
  next: Declarations,
  variables: Record<string, StyleValueDescriptor>,
  inheritedVariables: VariableContextValue,
) {
  const options: ResolveOptions = {
    castToArray: true,
    getVariable(name) {
      let value = resolveValue(variables?.[name], options);

      // If the value is already defined, we don't need to look it up
      if (value !== undefined) {
        return value;
      }

      // Is there a universal variable?
      value = resolveValue(next.get(universalVariables(name)), options);

      // Check if the variable is inherited
      if (value === undefined) {
        for (const inherited of inheritedVariables) {
          if (name in inherited) {
            value = resolveValue(inherited[name], options);
            if (value !== undefined) {
              break;
            }
          }
        }

        /**
         * Create a rerender guard incase the variable changes
         */
        next.guards?.push({
          type: "variable",
          name: name,
          value,
        });
      }

      // This is a bit redundant as inheritedVariables probably is rootVariables,
      // but this ensures a subscription is created for Fast Refresh
      value ??= next.get(rootVariables(name));

      return value;
    },
  };

  return Object.fromEntries(resolveValue(func, options));
}
