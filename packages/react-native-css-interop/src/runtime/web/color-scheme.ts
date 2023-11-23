import { AppState, Appearance } from "react-native";
import { StyleSheet } from "./stylesheet";
import { createSignal, useComputed } from "../signals";
import { INTERNAL_RESET } from "../../shared";

let appearance = Appearance;

let appearanceListener = appearance.addChangeListener((state) =>
  _colorScheme.set(state.colorScheme ?? "light"),
);

AppState.addEventListener("change", () =>
  _colorScheme.set(appearance.getColorScheme() ?? "light"),
);

// This shouldn't change, as its loaded from the CSS
const [darkMode, darkModeValue] = StyleSheet.getFlag("darkMode")?.split(
  " ",
) ?? ["media"];

let initialColor: "light" | "dark" | "system" = "system";
if (darkMode === "media") {
  initialColor = Appearance.getColorScheme() ?? "light";
  Appearance.addChangeListener(({ colorScheme }) => {
    if (darkMode === "media") {
      _colorScheme.set(colorScheme ?? "light");
    }
  });
} else if (darkMode === "class") {
  initialColor = globalThis.window.document.documentElement.classList.contains(
    darkModeValue,
  )
    ? "dark"
    : "light";
}

const _colorScheme = createSignal<"light" | "dark" | "system">(initialColor);
export const colorScheme = {
  ..._colorScheme,
  set(value: "light" | "dark" | "system") {
    _colorScheme.set(value);

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

    if (value === "dark") {
      globalThis.window?.document.documentElement.classList.add(darkModeValue);
    } else {
      globalThis.window?.document.documentElement.classList.remove(
        darkModeValue,
      );
    }
  },
  get() {
    let current = _colorScheme.get();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    return current;
  },
  toggle() {
    let current = _colorScheme.peek();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    _colorScheme.set(current === "light" ? "dark" : "light");
  },
  [INTERNAL_RESET]: ($appearance: typeof Appearance) => {
    _colorScheme.set("system");
    appearance = $appearance;
    appearanceListener.remove();
    appearanceListener = appearance.addChangeListener((state) =>
      _colorScheme.set(state.colorScheme ?? "light"),
    );
  },
};

export function useColorScheme() {
  return useComputed(() => {
    return {
      colorScheme: colorScheme.get(),
      setColorScheme: colorScheme.set,
      toggleColorScheme: colorScheme.toggle,
    };
  });
}
