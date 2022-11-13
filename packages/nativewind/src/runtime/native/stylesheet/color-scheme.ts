import { Appearance, ColorSchemeName } from "react-native";
import {
  darkModeKey,
  colorSchemeSystemKey,
  colorSchemeKey,
} from "../../common";
import { getVariablesForColorScheme, setVariables, variables } from "./runtime";

Appearance.addChangeListener(({ colorScheme }) => {
  if (variables.get(darkModeKey) === "class") {
    // Ignore automatically switching
    return;
  }
  internalSetColorScheme(colorScheme);
});

function internalSetColorScheme(system?: ColorSchemeName | "system" | null) {
  const colorScheme =
    !system || system === "system"
      ? Appearance.getColorScheme() || "light"
      : system;

  setVariables({
    [colorSchemeSystemKey]: system ?? "system",
    [colorSchemeKey]: colorScheme,
    ...getVariablesForColorScheme(colorScheme),
  });
}

export function setColorScheme(system?: ColorSchemeName | "system" | null) {
  if (variables.get(darkModeKey) !== "class") {
    console.error(
      `Cannot manually control color scheme. Please set "darkMode: 'class'" in your 'tailwind.config.js'`
    );
    return;
  }

  internalSetColorScheme(system);
}

export function getColorScheme() {
  return variables.get(colorSchemeKey) as "light" | "dark";
}

export function toggleColorScheme() {
  if (variables.get(darkModeKey) !== "class") {
    console.error(
      `Cannot manually control color scheme. Please set "darkMode: 'class'" in your 'tailwind.config.js'`
    );
    return;
  }

  const currentColor =
    variables.get(colorSchemeSystemKey) === "system"
      ? Appearance.getColorScheme() || "light"
      : variables.get(colorSchemeKey);

  internalSetColorScheme(currentColor === "light" ? "dark" : "light");
}
