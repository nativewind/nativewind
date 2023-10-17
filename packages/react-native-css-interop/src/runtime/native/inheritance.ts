import { createContext } from "react";
import { ExtractedStyleValue } from "../../types";
import { Signal, createSignal } from "../signals";
import { colorScheme } from "./color-scheme";
import type { InteropComputed } from "./interop";

export const rootVariables: Map<string, ColorSchemeSignal> = new Map();
export const universalVariables: Map<string, ColorSchemeSignal> = new Map();
export const effectContext = createContext({
  signals: rootVariables,
} as unknown as InteropComputed);
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
          signal = createColorSchemeSignal(name, value);
          map.set(name, signal);
        } else {
          signal.setLight(value);
        }
      }
    }

    if (dark) {
      for (const [name, value] of Object.entries(dark)) {
        let variable = map.get(name);
        if (!variable) {
          variable = createColorSchemeSignal(name);
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
  id: string,
  value?: any,
): ColorSchemeSignal {
  let light = createSignal<any>(value, `${id}#root-light`);
  let dark = createSignal<any>(value, `${id}#root-dark`);

  const get = () => {
    if (colorScheme.get() === "light") {
      return light.get();
    } else {
      return dark.peek() === "undefined" ? light.get() : dark.get();
    }
  };

  // Set the value and unsubscribe from the parent if the value is not undefined.
  const set = (nextValue: ExtractedStyleValue) => {
    colorScheme.peek() === "light" ? light.set(nextValue) : dark.set(nextValue);
  };

  const unsubscribe = (subscription: () => void) => {
    light.unsubscribe(subscription);
    dark.unsubscribe(subscription);
  };

  return {
    ...light,
    id,
    get,
    set,
    setLight: light.set,
    setDark: dark.set,
    unsubscribe,
  };
}
