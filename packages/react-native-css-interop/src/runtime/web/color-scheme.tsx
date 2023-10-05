import { Appearance } from "react-native";
import { StyleSheet } from "./stylesheet";
import { createSignal, useComputed } from "../signals";

const manualColorScheme = createSignal("light");

// This shouldn't change, as its loaded from the CSS
const [darkMode, darkModeValue] = StyleSheet.getFlag("darkMode")?.split(
  " ",
) ?? ["media"];

if (darkMode === "media") {
  manualColorScheme.set(Appearance.getColorScheme() ?? "light");

  Appearance.addChangeListener(({ colorScheme }) => {
    if (darkMode === "media") {
      manualColorScheme.set(colorScheme ?? "light");
    }
  });
} else if (darkMode === "class") {
  manualColorScheme.set(
    globalThis.window.document.documentElement.classList.contains(darkModeValue)
      ? "dark"
      : "light",
  );
}

export function useColorScheme() {
  return useComputed(() => ({
    colorScheme: manualColorScheme.get(),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  }));
}

export const colorScheme = {
  get: () => manualColorScheme.get(),
  set: (colorScheme: "light" | "dark" | "system") => {
    if (darkMode === "media") {
      throw new Error(
        "Cannot manually set color scheme, as dark mode is type 'media'. Please use StyleSheet.setFlag('darkMode', 'class')",
      );
    }

    if (!globalThis.window) {
      throw new Error(
        "Cannot manually set color scheme while not in a browser environment.",
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

    if (!newColorScheme) return;

    if (newColorScheme === "dark") {
      globalThis.window?.document.documentElement.classList.add(darkModeValue);
    } else {
      globalThis.window?.document.documentElement.classList.remove(
        darkModeValue,
      );
    }

    manualColorScheme.set(newColorScheme);
  },
  toggle() {
    colorScheme.set(colorScheme.get() === "dark" ? "light" : "dark");
  },
};
