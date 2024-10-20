import { Appearance, AppState, NativeEventSubscription } from "react-native";

import { INTERNAL_RESET } from "../../shared";
import { observable } from "../observable";
import { StyleSheet } from "./stylesheet";

let appearance = Appearance;
let appearanceListener: NativeEventSubscription | undefined;

const darkModeFlag = StyleSheet.getFlag("darkMode");

let darkMode: string | undefined;
let darkModeValue: string | undefined;
let initialColor: "light" | "dark" | undefined = undefined;

if (darkModeFlag) {
  const flags = darkModeFlag.split(" ");
  darkMode = flags[0];
  darkModeValue = flags[1];

  if (darkMode === "class") {
    initialColor =
      "window" in globalThis.window &&
      globalThis.window.document.documentElement.classList.contains(
        darkModeValue,
      )
        ? "dark"
        : "light";
  }
} else if ("window" in globalThis) {
  // In development, Expo might insert the StyleSheet AFTER this code runs.
  // Instead we watch for the stylesheet being added
  const headNode = globalThis.window.document.getElementsByTagName("head")[0];
  new MutationObserver(function (_, observer) {
    // We don't actually care what the mutation is, just wait until we have a darkMode setting
    const darkModeFlag = StyleSheet.getFlag("darkMode");
    if (!darkModeFlag) return;

    // We have the flag, so we can remove the observer
    observer.disconnect();
    const flags = darkModeFlag.split(" ");
    darkMode = flags[0];
    darkModeValue = flags[1];
    colorScheme.set(
      globalThis.window.document.documentElement.classList.contains(
        darkModeValue,
      )
        ? "dark"
        : "system",
    );
  }).observe(headNode, { attributes: false, childList: true, subtree: false });
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

    if (darkModeValue) {
      if (value === "dark") {
        globalThis.window?.document.documentElement.classList.add(
          darkModeValue,
        );
      } else {
        globalThis.window?.document.documentElement.classList.remove(
          darkModeValue,
        );
      }
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
