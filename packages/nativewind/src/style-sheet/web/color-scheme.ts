import { Appearance, ColorSchemeName } from "react-native";
import { colorSchemeKey, colorSchemeSystemKey, darkModeKey } from "../common";
import { getVariable } from "./runtime";

const rootStyle = getComputedStyle(document.documentElement);

Appearance.addChangeListener(({ colorScheme }) => {
  if (getVariable(darkModeKey) === "class") {
    return;
  }
  internalSetColorScheme(colorScheme);
});

function internalSetColorScheme(system?: ColorSchemeName | "system" | null) {
  const colorScheme =
    !system || system === "system"
      ? Appearance.getColorScheme() || "light"
      : system;

  if (colorScheme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function setColorScheme(system?: ColorSchemeName | "system" | null) {
  if (rootStyle.getPropertyValue(darkModeKey) !== "class") {
    console.error(
      "Cannot manually control color scheme. Please set 'darkMode' to 'class' in your 'tailwind.config.js'"
    );
    return;
  }

  internalSetColorScheme(system);
}

export function getColorScheme() {
  return getVariable(colorSchemeKey) as "light" | "dark";
}

export function toggleColorScheme() {
  if (getVariable(darkModeKey) !== "class") {
    console.error(
      "Cannot manually control color scheme. Please set 'darkMode' to 'class' in your 'tailwind.config.js'"
    );
    return;
  }

  const currentColor =
    getVariable(colorSchemeSystemKey) === "system"
      ? Appearance.getColorScheme() || "light"
      : getVariable(colorSchemeKey);

  internalSetColorScheme(currentColor === "light" ? "dark" : "light");
}
