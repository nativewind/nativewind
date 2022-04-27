import { PropsWithChildren, useState } from "react";
import { ColorSchemeName, Appearance, Platform } from "react-native";

import type { MediaRecord, StyleRecord } from "./types/common";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindSetColorSchemeContext,
  TailwindStyleContext,
} from "./context";

export interface TailwindProviderProps {
  styles?: StyleRecord;
  media?: MediaRecord;
  colorScheme?: ColorSchemeName;
  platform?: typeof Platform.OS | "native";
}

const nativePlatforms = new Set([
  "ios",
  "android",
  "windows",
  "macos",
  "native",
]);

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media,
  colorScheme: overrideColorScheme,
  platform = Platform.OS,
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    overrideColorScheme ?? Appearance.getColorScheme() ?? "light"
  );

  const platformValue = nativePlatforms.has(platform) ? "native" : platform;

  return (
    <TailwindStyleContext.Provider value={styles}>
      <TailwindMediaContext.Provider value={media}>
        <TailwindPlatformContext.Provider value={platformValue}>
          <TailwindColorSchemeContext.Provider
            value={overrideColorScheme || colorScheme}
          >
            <TailwindSetColorSchemeContext.Provider value={setColorScheme}>
              {children}
            </TailwindSetColorSchemeContext.Provider>
          </TailwindColorSchemeContext.Provider>
        </TailwindPlatformContext.Provider>
      </TailwindMediaContext.Provider>
    </TailwindStyleContext.Provider>
  );
}
