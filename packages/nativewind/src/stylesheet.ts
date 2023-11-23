import {
  StyleSheet,
  useColorScheme as useCSSColorScheme,
} from "react-native-css-interop";

export function useColorScheme() {
  const colorScheme = useCSSColorScheme();
  return {
    ...colorScheme,
    setColorScheme(scheme: Parameters<typeof colorScheme.setColorScheme>[0]) {
      const darkMode = StyleSheet.getFlag("darkMode") ?? "media";
      if (darkMode === "media") {
        throw new Error(
          "Unable to manually set color scheme without using darkMode: class. See: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually",
        );
      }

      colorScheme?.setColorScheme(scheme);
    },
    toggleColorScheme() {
      const darkMode = StyleSheet.getFlag("darkMode") ?? "media";
      if (darkMode === "media") {
        throw new Error(
          "Unable to manually set color scheme without using darkMode: class. See: https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually",
        );
      }

      colorScheme?.toggleColorScheme();
    },
  };
}
