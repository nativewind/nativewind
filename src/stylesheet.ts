import {
  Appearance,
  useColorScheme as useRNColorScheme,
  type ColorSchemeName,
} from "react-native";

/** @deprecated Use useColorScheme from "react-native" instead */
export function useColorScheme() {
  return {
    colorScheme: useRNColorScheme(),
    setColorScheme(scheme: ColorSchemeName | "system" | null) {
      // React Native 0.82 changed 'system' to null/unspecified
      // Handle both for backward compatibility
      if (scheme === "system") {
        Appearance.setColorScheme(null);
      } else {
        Appearance.setColorScheme(scheme);
      }
    },
    toggleColorScheme() {
      Appearance.setColorScheme(
        Appearance.getColorScheme() === "dark" ? "light" : "dark",
      );
    },
  };
}
