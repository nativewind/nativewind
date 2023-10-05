import { Appearance } from "react-native";
import { createSignal, useComputed } from "../signals";
import { INTERNAL_RESET } from "../../shared";
import { useContext } from "react";
import { effectContext } from "./inheritance";

export const colorScheme = createColorScheme(Appearance);

export function useColorScheme() {
  const interop = useContext(effectContext);
  return useComputed(
    () => ({
      colorScheme: colorScheme.get(),
      setColorScheme: colorScheme.set,
      toggleColorScheme: colorScheme.toggle,
    }),
    interop,
  );
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

  let listener = appearance.addChangeListener(({ colorScheme }) => {
    if (isSystem) {
      set(colorScheme ?? "light");
    }
  });

  const reset = (appearance: typeof Appearance) => {
    listener.remove();
    listener = appearance.addChangeListener(({ colorScheme }) => {
      if (isSystem) {
        signal.set(colorScheme ?? "light");
      }
    });
    isSystem = true;
    signal.set(appearance.getColorScheme() ?? "light");
  };

  return {
    get: signal.get,
    set,
    toggle,
    [INTERNAL_RESET]: reset,
  };
}
