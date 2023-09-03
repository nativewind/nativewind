import {
  StyleSheet,
  colorScheme as cssColorScheme,
  useColorScheme as useCSSColorScheme,
} from "react-native-css-interop";

const colorScheme = {
  ...cssColorScheme,
  toggle: () => {
    return colorScheme.set(colorScheme.get() === "dark" ? "light" : "dark");
  },
  set: (scheme: "dark" | "light" | "system") => {
    const darkMode = StyleSheet.getFlag("darkMode") ?? "media";
    if (darkMode.indexOf("media") === 0) {
      throw new Error(
        "Unable to manually set color scheme without using darkMode: class. See: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually",
      );
    }

    cssColorScheme.set(scheme);
  },
};

export function useColorScheme() {
  return {
    ...useCSSColorScheme(),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  };
}
