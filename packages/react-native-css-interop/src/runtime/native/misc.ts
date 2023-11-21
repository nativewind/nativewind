import { createContext } from "react";
import { AccessibilityInfo, Dimensions } from "react-native";
import { createSignal } from "../signals";
import { INTERNAL_RESET, INTERNAL_SET } from "../../shared";
import { ContainerRuntime } from "../../types";
import { colorScheme } from "./color-scheme";
import { InteropReducerState } from "./style";

export const globalVariables = {
  root: new Map<string, ColorSchemeSignal>(),
  universal: new Map<string, ColorSchemeSignal>(),
};

export const ContainerContext = createContext<Record<string, ContainerRuntime>>(
  {},
);

const rootContext = {
  inlineVariables: globalVariables.root,
  getContainer() {},
  getVariable(name: string) {
    return globalVariables.root.get(name)?.get();
  },
} as unknown as InteropReducerState;
export const interopContext = createContext(rootContext);
export const InteropProvider = interopContext.Provider;

export const rem = createColorSchemeSignal("rem");
export const vw = viewportUnit("width", Dimensions);
export const vh = viewportUnit("height", Dimensions);
function viewportUnit(key: "width" | "height", dimensions: Dimensions) {
  const signal = createSignal<number>(dimensions.get("window")[key] || 0);

  let subscription = dimensions.addEventListener("change", ({ window }) => {
    signal.set(window[key]);
  });

  const get = () => signal.get() || 0;
  const reset = (dimensions: Dimensions) => {
    signal.set(dimensions.get("window")[key] || 0);
    subscription.remove();
    subscription = dimensions.addEventListener("change", ({ window }) => {
      signal.set(window[key]);
    });
  };

  return { get, [INTERNAL_RESET]: reset, [INTERNAL_SET]: signal.set };
}

export const isReduceMotionEnabled = (function createIsReduceMotionEnabled() {
  const signal = createSignal(false);
  // Hopefully this resolves before the first paint...
  AccessibilityInfo.isReduceMotionEnabled()?.then(signal.set);
  AccessibilityInfo.addEventListener("reduceMotionChanged", signal.set);

  return { ...signal, [INTERNAL_RESET]: () => signal.set(false) };
})();

export type ColorSchemeSignal = ReturnType<typeof createColorSchemeSignal>;

/**
 * A special signal that can be used to set a value for both light and dark color schemes.
 * Currently only used for root and universal variables.
 */
export function createColorSchemeSignal(id: string) {
  let light = createSignal<any>(undefined, `${id}#light`);
  let dark = createSignal<any>(undefined, `${id}#dark`);

  const get = () => {
    return colorScheme.get() === "light"
      ? light.get()
      : dark.get() ?? light.get();
  };

  const peek = () => {
    return colorScheme.peek() === "light"
      ? light.peek()
      : dark.peek() ?? light.peek();
  };

  const unsubscribe = (subscription: () => void) => {
    dark.unsubscribe(subscription);
    light.unsubscribe(subscription);
  };

  const set = (value: Record<string, any> | any) => {
    if (typeof value === "object") {
      if ("dark" in value) dark.set(value.dark);
      if ("light" in value) light.set(value.light);
    } else {
      light.set(value);
      dark.set(value);
    }
  };

  return {
    id,
    get,
    set,
    peek,
    unsubscribe,
  };
}
