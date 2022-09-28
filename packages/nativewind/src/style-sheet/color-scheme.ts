import { Appearance, ColorSchemeName } from "react-native";
import context from "./context";

export function resetColorScheme() {
  try {
    if (typeof localStorage !== "undefined") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const hasLocalStorageTheme = "nativewind_theme" in localStorage;

      const colorScheme: NonNullable<ColorSchemeName> =
        localStorage.nativewind_theme === "dark" ||
        (!hasLocalStorageTheme && isDarkMode)
          ? "dark"
          : "light";

      setColorScheme(colorScheme);

      context.topicListeners.add((topics) => {
        if (topics["colorScheme"] !== localStorage.nativewind_theme) {
          localStorage.nativewind_theme = topics["colorScheme"];
        }
      });
    }
  } catch {
    // Do nothing
  }
}

Appearance.addChangeListener(({ colorScheme }) => {
  setColorScheme(colorScheme);
});

export function setColorScheme(system?: ColorSchemeName | "system" | null) {
  const colorScheme =
    !system || system === "system"
      ? Appearance.getColorScheme() || "light"
      : system;

  if (typeof window !== "undefined") {
    if (colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    context.setTopics(getDocumentVariables());
  }

  context.setTopics({
    colorSchemeSystem: system ?? "system",
    colorScheme,
    ...(colorScheme === "light"
      ? context.rootVariableValues
      : context.darkRootVariableValues),
  });
}

export function getColorScheme() {
  return context.topics["colorScheme"] as "light" | "dark";
}

export function toggleColorScheme() {
  return context.setTopics((state) => {
    const currentColor =
      state["colorSchemeSystem"] === "system"
        ? Appearance.getColorScheme() || "light"
        : state["colorScheme"];

    const colorScheme = currentColor === "light" ? "dark" : "light";

    return {
      colorScheme,
      colorSchemeSystem: colorScheme,
      ...(colorScheme === "light"
        ? context.rootVariableValues
        : context.darkRootVariableValues),
    };
  });
}

function getDocumentVariables() {
  const style = getComputedStyle(document.documentElement);
  const variableKeys = Array.from(style).filter((key) => key.startsWith("--"));

  return Object.fromEntries(
    variableKeys.map((key) => {
      return [key, style.getPropertyValue(key)];
    })
  );
}
