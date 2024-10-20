import {
  AccessibilityInfo,
  Appearance,
  AppState,
  NativeEventSubscription,
} from "react-native";

import { INTERNAL_RESET } from "../../shared";
import { ColorSchemeVariableValue, RuntimeValueDescriptor } from "../../types";
import { Effect, observable, ObservableOptions } from "../observable";

/**
 * Color scheme
 */
export const systemColorScheme = observable<"light" | "dark">(
  Appearance.getColorScheme() ?? "light",
);
const colorSchemeObservable = observable<"light" | "dark" | undefined>(
  undefined,
);

export const colorScheme = {
  set(value: "light" | "dark" | "system") {
    if (value === "system") {
      appearance.setColorScheme(null);
    } else {
      appearance.setColorScheme(value);
    }

    // Appearance.addChangeListener is not fired in a test environment
    if (process.env.NODE_ENV === "test") {
      colorSchemeObservable.set(value === "system" ? "light" : value);
    }
  },
  get(effect?: Effect) {
    return colorSchemeObservable.get(effect) ?? systemColorScheme.get(effect);
  },
  getSystem(effect?: Effect) {
    return colorSchemeObservable.get(effect) ?? systemColorScheme.get(effect);
  },
  toggle() {
    let current = colorSchemeObservable.get();
    if (current === undefined) current = appearance.getColorScheme() ?? "light";
    colorScheme.set(current === "light" ? "dark" : "light");
  },
  [INTERNAL_RESET]: (appearance: typeof Appearance) => {
    colorSchemeObservable.set(undefined);
    resetAppearanceListeners(appearance, AppState);
  },
};

/**
 * CSS Variables
 *
 * Variables can change based on color scheme. So we need to store two values.
 */
export function cssVariableObservable(
  value?: ColorSchemeVariableValue,
  { name }: ObservableOptions<never> = {},
) {
  const light = observable(value?.light, { name: `${name}#light` });
  const dark = observable(value?.dark, {
    name: `${name}#dark`,
    fallback: light,
  });

  return {
    name,
    get(effect?: Effect) {
      return colorScheme.get(effect) === "light"
        ? light.get(effect)
        : dark.get(effect);
    },
    set(value: ColorSchemeVariableValue | RuntimeValueDescriptor) {
      if (typeof value === "object" && value) {
        if ("dark" in value) dark.set(value.dark);
        if ("light" in value) light.set(value.light);
      } else {
        light.set(value);
        dark.set(value);
      }
    },
  };
}

/**
 * Appearance
 */
let appearance = Appearance;
let appearanceListener: NativeEventSubscription | undefined;
let appStateListener: NativeEventSubscription | undefined;

function resetAppearanceListeners(
  $appearance: typeof Appearance,
  appState: typeof AppState,
) {
  appearance = $appearance;
  appearanceListener?.remove();
  appStateListener?.remove();

  appearanceListener = appearance.addChangeListener((state) => {
    if (AppState.currentState === "active") {
      systemColorScheme.set(state.colorScheme ?? "light");
    }
  });

  appStateListener = appState.addEventListener("change", (type) => {
    if (type === "active") {
      const colorScheme = appearance.getColorScheme() ?? "light";
      systemColorScheme.set(colorScheme);
    }
  });
}
resetAppearanceListeners(appearance, AppState);

/**
 * isReduceMotionEnabled
 */
export const isReduceMotionEnabled = Object.assign(
  observable<boolean>(false, { name: "isReduceMotionEnabled" }),
  { [INTERNAL_RESET]: () => isReduceMotionEnabled.set(false) },
);
// Hopefully this resolves before the first paint...
AccessibilityInfo.isReduceMotionEnabled()?.then(isReduceMotionEnabled.set);
AccessibilityInfo.addEventListener("reduceMotionChanged", (value) => {
  isReduceMotionEnabled.set(value);
});
