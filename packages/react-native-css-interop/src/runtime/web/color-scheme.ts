import { AppState, Appearance, NativeEventSubscription } from "react-native";
import { StyleSheet } from "./stylesheet";
import { INTERNAL_RESET } from "../../shared";
import { observable } from "../observable";

let appearance = Appearance;
let appearanceListener: NativeEventSubscription | undefined;

// This shouldn't change, as its loaded from the CSS
const [darkMode, darkModeValue] = StyleSheet.getFlag("darkMode")?.split(
  " ",
) ?? ["media"];

let initialColor: "light" | "dark" | undefined = undefined;
if (darkMode === "class") {
  initialColor = globalThis.window.document.documentElement.classList.contains(
    darkModeValue,
  )
    ? "dark"
    : "light";
}

const systemColorScheme = observable<"light" | "dark">(
  appearance.getColorScheme() ?? "light",
);

const colorSchemeObservable = observable<"light" | "dark" | undefined>(
  initialColor,
  { fallback: systemColorScheme },
);

export const colorScheme = {
  set(value: "light" | "dark" | "system") {
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

    if (value === "system") {
      colorSchemeObservable.set(undefined);
    } else {
      colorSchemeObservable.set(value);
    }

    if (value === "dark") {
      globalThis.window?.document.documentElement.classList.add(darkModeValue);
    } else {
      globalThis.window?.document.documentElement.classList.remove(
        darkModeValue,
      );
    }
  },
  get: colorSchemeObservable.get,
  toggle() {
    let current = colorSchemeObservable.get();
    if (current === undefined) current = appearance.getColorScheme() ?? "light";
    colorScheme.set(current === "light" ? "dark" : "light");
  },
  [INTERNAL_RESET]: (appearance: typeof Appearance) => {
    colorSchemeObservable.set(undefined);
    resetAppearanceListeners(appearance);
  },
};

function resetAppearanceListeners($appearance: typeof Appearance) {
  appearance = $appearance;
  appearanceListener?.remove();
  appearanceListener = appearance.addChangeListener((state) => {
    if (AppState.currentState === "active") {
      systemColorScheme.set(state.colorScheme ?? "light");
    }
  });
}
resetAppearanceListeners(appearance);
