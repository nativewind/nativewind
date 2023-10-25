import { AppState, Appearance } from "react-native";
import { createSignal, useComputed } from "../signals";
import { INTERNAL_RESET } from "../../shared";

let appearance = Appearance;

let appearanceListener = appearance.addChangeListener((state) =>
  _appColorScheme.set(state.colorScheme ?? "light"),
);

AppState.addEventListener("change", () =>
  _appColorScheme.set(appearance.getColorScheme() ?? "light"),
);

const _appColorScheme = createSignal<"light" | "dark" | "system">("system");
export const colorScheme = {
  ..._appColorScheme,
  set(value: "light" | "dark" | "system") {
    _appColorScheme.set(value);
    if (value === "system") {
      appearance.setColorScheme(null);
    } else {
      appearance.setColorScheme(value);
    }
  },
  get() {
    let current = _appColorScheme.get();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    return current;
  },
  toggle() {
    let current = _appColorScheme.peek();
    if (current === "system") current = appearance.getColorScheme() ?? "light";
    _appColorScheme.set(current === "light" ? "dark" : "light");
  },
  [INTERNAL_RESET]: ($appearance: typeof Appearance) => {
    _appColorScheme.set("system");
    appearance = $appearance;
    appearanceListener.remove();
    appearanceListener = appearance.addChangeListener((state) =>
      _appColorScheme.set(state.colorScheme ?? "light"),
    );
  },
};

export function useColorScheme() {
  return useComputed(() => ({
    colorScheme: colorScheme.get(),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  }));
}
