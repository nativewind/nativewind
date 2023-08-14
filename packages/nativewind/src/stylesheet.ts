import {
  StyleSheet as CSSStyleSheet,
  colorScheme,
  useColorScheme as useCSSColorScheme,
} from "react-native-css-interop";

const nativewindStyleSheet = {
  getColorScheme: () => colorScheme.get(),
  toggleColorScheme: () => {
    return nativewindStyleSheet.setColorScheme(
      colorScheme.get() === "dark" ? "light" : "dark",
    );
  },
  setColorScheme: (scheme: "dark" | "light" | "system") => {
    const darkMode = StyleSheet.getFlag("darkMode") ?? "media";
    if (darkMode.indexOf("media") === 0) {
      throw new Error(
        "Unable to manually set color scheme without using darkMode: class. See: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually",
      );
    }

    colorScheme.set(scheme);
  },
};

export const StyleSheet = Object.assign(
  {},
  CSSStyleSheet,
  nativewindStyleSheet,
);

export function useColorScheme() {
  return {
    ...useCSSColorScheme(),
    setColorScheme: StyleSheet.setColorScheme,
    toggleColorScheme: StyleSheet.toggleColorScheme,
  };
}
