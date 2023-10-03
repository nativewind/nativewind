import { createContext, useContext } from "react";
import { ExtractedStyleValue } from "../../types";
import { Signal, createSignal, useSignals } from "../signals";
import { colorScheme } from "./color-scheme";
import type { InteropEffect } from "./interop-effect";

const rootInheritance = {
  getContainers() {
    return {};
  },
};

export const rootVariables: Map<string, ColorSchemeSignal> = new Map();
export const universalVariables: Map<string, ColorSchemeSignal> = new Map();
export const effectContext = createContext(
  rootInheritance as unknown as InteropEffect,
);
export const InheritanceProvider = effectContext.Provider;

function createRootVariableSetter(map: typeof rootVariables) {
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

export const setRootVariables = createRootVariableSetter(rootVariables);
export const setUniversalVariables =
  createRootVariableSetter(universalVariables);

export type ColorSchemeSignal = Signal<ExtractedStyleValue> & {
  setLight: (value: ExtractedStyleValue) => void;
  setDark: (value: ExtractedStyleValue) => void;
};

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

/**
 * Replicate CSS's inheritance model for variables.
 */
export function getInheritedVariable(name: string, effect: InteropEffect) {}

export function setInlineVariable() {}

export function createInheritableSignal<T = ExtractedStyleValue>(
  value: T | undefined,
  parent?: Signal<T>,
) {
  let signal = createSignal(value);

  const inheritableSignal = {
    ...signal,
    get() {
      return signal.get() ?? parent?.get();
    },
    set(nextValue: T | undefined) {
      if (nextValue !== undefined && signal.peek() === undefined) {
        if (parent) {
          for (const subscription of signal.subscriptions) {
            parent.unsubscribe(subscription);
          }
        }
      }
      signal.set(nextValue);
    },
    unsubscribe(callback: () => void) {
      signal.unsubscribe(callback);
      if (parent) {
        parent.unsubscribe(callback);
      }
    },
  };

  return inheritableSignal;
}

export const useUnstableNativeVariable = (name: string) => {
  useSignals();
  const effect = useContext(effectContext);
  return (
    effect.inlineVariables.get(name) ?? effect.inheritedVariables.get(name)
  )?.get();
};
