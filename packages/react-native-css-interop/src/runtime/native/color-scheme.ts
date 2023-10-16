import { AppState, Appearance } from "react-native";
import { createSignal, useComputed } from "../signals";
import { INTERNAL_RESET } from "../../shared";

export const colorScheme = createColorScheme(Appearance);

export function useColorScheme() {
  return useComputed(() => ({
    colorScheme: colorScheme.get(),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  }));
}

function createColorScheme(appearance: typeof Appearance) {
  let isSystem = true;
  const signal = createSignal<"light" | "dark">(
    appearance.getColorScheme() ?? "light",
  );

  const set = (colorScheme: "light" | "dark" | "system") => {
    let newColorScheme;
    if (colorScheme === "system") {
      newColorScheme = appearance.getColorScheme() ?? "light";
    } else {
      newColorScheme = colorScheme;
    }

    signal.set(newColorScheme);
    appearance.setColorScheme(newColorScheme);
  };

  const toggle = () => {
    if (signal.get() === "light") {
      set("dark");
    } else {
      set("light");
    }
  };

  let appStateListener = AppState.addEventListener("change", (state) => {
    if (state === "active" && isSystem) {
      set(appearance.getColorScheme() ?? "light");
    }
  });

  let appearanceListener = appearance.addChangeListener(({ colorScheme }) => {
    if (isSystem) {
      set(colorScheme ?? "light");
    }
  });

  const reset = (appearance: typeof Appearance) => {
    appStateListener.remove();
    appStateListener = AppState.addEventListener("change", (state) => {
      if (state === "active" && isSystem) {
        set(appearance.getColorScheme() ?? "light");
      }
    });
    appearanceListener.remove();
    appearanceListener = appearance.addChangeListener(({ colorScheme }) => {
      if (isSystem) {
        signal.set(colorScheme ?? "light");
      }
    });
    isSystem = true;
    signal.set(appearance.getColorScheme() ?? "light");
  };

  return {
    ...signal,
    set,
    toggle,
    [INTERNAL_RESET]: reset,
  };
}
