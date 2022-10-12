import { Appearance, ColorSchemeName } from "react-native";
import context from "./context";
import { recomputeWebVariables } from "./variables";

const darkModeKey = "--color-scheme";
const colorSchemeKey = "--color-scheme";
const colorSchemeSystemKey = "--color-scheme-system";

Appearance.addChangeListener(({ colorScheme }) => {
  if (context.topics[darkModeKey] === "class") {
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

  context.setTopics({
    [colorSchemeSystemKey]: system ?? "system",
    [colorSchemeKey]: colorScheme,
    ...(colorScheme === "light"
      ? context.rootVariableValues
      : context.darkRootVariableValues),
  });
}

export function setColorScheme(system?: ColorSchemeName | "system" | null) {
  if (context.topics[darkModeKey] !== "class") {
    console.error(
      "Cannot manually control color scheme. Please set 'darkMode' to 'class' in your 'tailwind.config.js'"
    );
    return;
  }

  internalSetColorScheme(system);
}

export function getColorScheme() {
  return context.topics[colorSchemeKey] as "light" | "dark";
}

export function toggleColorScheme() {
  if (context.topics[darkModeKey] !== "class") {
    console.error(
      "Cannot manually control color scheme. Please set 'darkMode' to 'class' in your 'tailwind.config.js'"
    );
    return;
  }

  const currentColor =
    context.topics[colorSchemeSystemKey] === "system"
      ? Appearance.getColorScheme() || "light"
      : context.topics[colorSchemeKey];

  internalSetColorScheme(currentColor === "light" ? "dark" : "light");
}
