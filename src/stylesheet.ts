import {
  Appearance,
  useColorScheme as useRNColorScheme,
  type ColorSchemeName,
} from "react-native";

/** @deprecated Use useColorScheme from "react-native" instead */
export function useColorScheme() {
  return {
    colorScheme: useRNColorScheme(),
    setColorScheme(scheme: ColorSchemeName) {
      Appearance.setColorScheme(scheme);
    },
    toggleColorScheme() {
      Appearance.setColorScheme(
        Appearance.getColorScheme() === "dark" ? "light" : "dark",
      );
    },
  };
}
