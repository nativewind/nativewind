import { createContext } from "react";
import { createSignal } from "../signals";
import { colorScheme } from "./color-scheme";
import type { InteropComputed } from "./interop";

export const globalVariables = {
  root: new Map<string, ColorSchemeSignal>(),
  universal: new Map<string, ColorSchemeSignal>(),
};

export const effectContext = createContext({
  signals: globalVariables.root,
} as unknown as InteropComputed);
export const InheritanceProvider = effectContext.Provider;

type ColorSchemeSignal = ReturnType<typeof createColorSchemeSignal>;

/**
 * A special signal that can be used to set a value for both light and dark color schemes.
 * Currently only used for root and universal variables.
 */
export function createColorSchemeSignal(id: string) {
  let light = createSignal<any>(undefined, `${id}#light`);
  let dark = createSignal<any>(undefined, `${id}#dark-app`);

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

  const set = (value: Record<string, any>) => {
    if ("dark" in value) dark.set(value.dark);
    if ("light" in value) light.set(value.light);
  };

  return {
    id,
    get,
    set,
    peek,
    unsubscribe,
  };
}
