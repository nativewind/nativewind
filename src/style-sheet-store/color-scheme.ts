import { Appearance } from "react-native";

export type ColorSchemeName = "light" | "dark";
export type ColorSchemeSystem = "light" | "dark" | "system";

export abstract class ColorSchemeStore {
  colorSchemeListeners = new Set<() => void>();
  colorScheme: ColorSchemeName;
  colorSchemeSystem: ColorSchemeSystem;

  constructor(colorSchemeSystem?: ColorSchemeSystem) {
    if (colorSchemeSystem === "system" || colorSchemeSystem === undefined) {
      this.colorScheme = Appearance.getColorScheme() || "light";
      this.colorSchemeSystem = "system";
    } else {
      this.colorScheme = colorSchemeSystem;
      this.colorSchemeSystem = colorSchemeSystem;
    }

    if (typeof localStorage !== "undefined") {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      this.subscribeColorScheme(() => {
        if (this.colorSchemeSystem === "system") {
          localStorage.removeItem("theme");
        } else {
          localStorage.theme = this.colorSchemeSystem;
        }
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
    this.colorSchemeSystem = colorSchemeSystem;
    this.colorScheme =
      colorSchemeSystem === "system"
        ? Appearance.getColorScheme() || "light"
        : colorSchemeSystem;

    this.notifyMedia(["colorScheme"]);
    this.notifyColorScheme();
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
