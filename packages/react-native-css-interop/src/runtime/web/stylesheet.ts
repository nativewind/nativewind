import { StyleSheet as RNStyleSheet } from "react-native";
import { CommonStyleSheet } from "../../types";
import {
  DarkMode,
  DevHotReloadSubscription,
  INTERNAL_RESET,
} from "../../shared";

export const useUnstableNativeVariables = () => ({});
export function vars(variables: Record<`--${string}`, string | number>) {
  return variables;
}

const commonStyleSheet: CommonStyleSheet = {
  [INTERNAL_RESET](_options) {
    return;
  },
  classNameMergeStrategy(c) {
    return c;
  },
  [DevHotReloadSubscription]() {
    return () => {};
  },
  register(_options) {
    throw new Error("Stylesheet.register is not available on web");
  },
  [DarkMode]: { type: "media" },
  setColorScheme(colorScheme) {
    if (this[DarkMode].type === "media") {
      throw new Error(
        "Cannot manually set color scheme, as dark mode is type 'media'. Please use setDarkModeClass first",
      );
    }

    let newColorScheme: "light" | "dark" | undefined;

    if (colorScheme === "system") {
      if (typeof window !== undefined) {
        newColorScheme = window.matchMedia("(prefers-color-scheme: dark)")
          ? "dark"
          : "light";
      }
    } else {
      newColorScheme = colorScheme;
    }

    if (newColorScheme === "dark") {
      globalThis?.window.document.classList.add(this[DarkMode]);
    } else {
      globalThis?.window.document.classList.remove(this[DarkMode]);
    }
  },
  setDarkMode(type) {
    this[DarkMode] = type;
  },
  setRem(value) {
    const document = globalThis.window?.document;
    if (document) {
      document.style.fontSize = `${value}px`;
    } else {
      throw new Error(
        "Cannot use setRem during SSR. Please either manually set it or use CSS styles.",
      );
    }
  },
  getRem(value) {
    const document = globalThis.window?.document;
    if (document) {
      document.style.fontSize = `${value}px`;
    } else {
      throw new Error("Cannot use getRem during SSR");
    }
  },
};

export const StyleSheet = Object.assign({}, commonStyleSheet, RNStyleSheet);
