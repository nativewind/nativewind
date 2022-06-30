import { Appearance } from "react-native";

export type ColorSchemeName = "light" | "dark";
export type ColorSchemeSystem = "light" | "dark" | "system";

export abstract class ColorSchemeStore {
  colorSchemeListeners = new Set<() => void>();
  colorScheme: ColorSchemeName = Appearance.getColorScheme() || "light";
  colorSchemeSystem: ColorSchemeSystem = "system";

  constructor() {
    if (typeof localStorage !== "undefined") {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && isDarkMode)
      ) {
        document.documentElement.classList.add("dark");
        this.colorScheme = "dark";
      } else {
        document.documentElement.classList.remove("dark");
        this.colorScheme = "light";
      }

      this.subscribeColorScheme(() => {
        localStorage.theme = this.colorScheme;
      });
    }
  }

  abstract notifyMedia(_: string[]): void;

  private notifyColorScheme() {
    for (const l of this.colorSchemeListeners) l();
  }

  subscribeColorScheme = (listener: () => void) => {
    this.colorSchemeListeners.add(listener);
    return () => this.colorSchemeListeners.delete(listener);
  };

  getColorScheme = () => {
    return this.colorScheme;
  };

  setColorScheme = (colorSchemeSystem: ColorSchemeSystem) => {
    const oldColorScheme = this.colorScheme;

    this.colorSchemeSystem = colorSchemeSystem;
    this.colorScheme =
      this.colorSchemeSystem === "system"
        ? Appearance.getColorScheme() || "light"
        : this.colorSchemeSystem;

    if (oldColorScheme !== this.colorScheme) {
      this.notifyMedia(["colorScheme"]);
      this.notifyColorScheme();
    }
  };

  toggleColorScheme = () => {
    const currentColor =
      this.colorSchemeSystem === "system"
        ? Appearance.getColorScheme() || "light"
        : this.colorScheme;

    this.colorScheme = currentColor === "light" ? "dark" : "light";
    this.colorSchemeSystem = currentColor;
    this.notifyMedia(["colorScheme"]);
    this.notifyColorScheme();
  };
}
