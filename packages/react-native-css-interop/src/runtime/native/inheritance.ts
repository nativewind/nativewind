import { createContext } from "react";
import { ExtractedStyleValue } from "../../types";
import { Signal, createSignal } from "../signals";
import { colorScheme } from "./color-scheme";
import type { InteropEffect } from "./interop-effect";

export const rootVariables: Map<string, ColorSchemeSignal> = new Map();
export const universalVariables: Map<string, ColorSchemeSignal> = new Map();
export const effectContext = createContext({
  inheritedVariables: new Map(),
  inlineVariables: rootVariables,
  inheritedContainers: new Map(),
  inlineContainers: new Map(),
} as unknown as InteropEffect);
export const InheritanceProvider = effectContext.Provider;

function createVariableSetter(map: typeof rootVariables) {
  return function (
    light?: Record<string, ExtractedStyleValue>,
    dark?: Record<string, ExtractedStyleValue>,
  ) {
    if (light) {
      for (const [name, value] of Object.entries(light)) {
        let signal = map.get(name);
        if (!signal) {
          signal = createColorSchemeSignal();
          map.set(name, signal);
        }
        signal.setLight(value);
      }
    }

    if (dark) {
      for (const [name, value] of Object.entries(dark)) {
        let variable = map.get(name);
        if (!variable) {
          variable = createColorSchemeSignal();
          map.set(name, variable);
        }
        variable.setDark(value);
      }
    }
  };
}

export const setRootVariables = createVariableSetter(rootVariables);
export const setUniversalVariables = createVariableSetter(universalVariables);

export type ColorSchemeSignal = Signal<ExtractedStyleValue> & {
  setLight: (value: ExtractedStyleValue) => void;
  setDark: (value: ExtractedStyleValue) => void;
};

/**
 * A special signal that can be used to set a value for both light and dark color schemes.
 * Currently only used for root and universal variables.
 */
export function createColorSchemeSignal(
  lightValue: ExtractedStyleValue | undefined = undefined,
  darkValue = lightValue,
): ColorSchemeSignal {
  let light = createSignal(lightValue);
  let dark = createSignal(darkValue);

  const get = () => {
    return colorScheme.get() === "light" ? light.get() : dark.get();
  };

  // Set the value and unsubscribe from the parent if the value is not undefined.
  const set = (nextValue: ExtractedStyleValue) => {
    colorScheme.get() === "light" ? light.set(nextValue) : dark.set(nextValue);
  };

  const unsubscribe = (subscription: () => void) => {
    light.unsubscribe(subscription);
    dark.unsubscribe(subscription);
  };

  return {
    ...light,
    get,
    set,
    setLight: light.set,
    setDark: dark.set,
    unsubscribe,
  };
}
