import { getEasing, type ReanimatedMutable } from "../animations";
import { ConfigReducerState } from "../state/config";
import type { StateWithStyles } from "../styles";
import { getValue } from "../utils/properties";

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

  let transitions = next.styles.transitions;
  if (!transitions) {
    transitions = new Map();
    next.styles.transitions = transitions;
  }

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
        transition.d?.[index % transition.d.length] ?? 0,
        withTiming(value, {
          duration: transition.l?.[index % transition.l.length] ?? 0,
          easing: getEasing(
            transition.t?.[index % transition.t.length],
            Easing,
          ),
        }),
      );
    };
  };
}
