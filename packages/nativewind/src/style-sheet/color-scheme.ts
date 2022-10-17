import { Appearance, ColorSchemeName } from "react-native";
import {
  getVariablesForColorScheme,
  recomputeWebVariables,
  setVariables,
  variables,
} from "./runtime";

const darkModeKey = "--dark-mode";
const colorSchemeKey = "--color-scheme";
const colorSchemeSystemKey = "--color-scheme-system";

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

  if (typeof document !== "undefined") {
    if (colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    recomputeWebVariables();
  }

  setVariables({
    [colorSchemeSystemKey]: system ?? "system",
    [colorSchemeKey]: colorScheme,
    ...getVariablesForColorScheme(colorScheme),
  });
}

export function setColorScheme(system?: ColorSchemeName | "system" | null) {
  if (variables.get(darkModeKey) !== "class") {
    console.error(
      "Cannot manually control color scheme. Please set 'darkMode' to 'class' in your 'tailwind.config.js'"
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
      "Cannot manually control color scheme. Please set 'darkMode' to 'class' in your 'tailwind.config.js'"
    );
    return;
  }

  const currentColor =
    variables.get(colorSchemeSystemKey) === "system"
      ? Appearance.getColorScheme() || "light"
      : variables.get(colorSchemeKey);

  internalSetColorScheme(currentColor === "light" ? "dark" : "light");
}
