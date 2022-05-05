import { PropsWithChildren, useState } from "react";
import { ColorSchemeName, Appearance, Platform } from "react-native";

import type { MediaRecord, StyleRecord } from "./types/common";

import {
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindPreviewContext,
  TailwindSetColorSchemeContext,
  TailwindStyleContext,
} from "./context";

export interface TailwindProviderProps {
  styles?: StyleRecord;
  media?: MediaRecord;
  colorScheme?: ColorSchemeName;
  platform?: typeof Platform.OS | "native";
  preview?: boolean;
}

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media,
  colorScheme: overrideColorScheme,
  platform = Platform.OS,
  preview = false,
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    overrideColorScheme ?? Appearance.getColorScheme() ?? "light"
  );

  return (
    <TailwindStyleContext.Provider value={styles}>
      <TailwindMediaContext.Provider value={media}>
        <TailwindPlatformContext.Provider value={platform}>
          <TailwindPreviewContext.Provider value={preview}>
            <TailwindColorSchemeContext.Provider
              value={overrideColorScheme || colorScheme}
            >
              <TailwindSetColorSchemeContext.Provider value={setColorScheme}>
                {children}
              </TailwindSetColorSchemeContext.Provider>
            </TailwindColorSchemeContext.Provider>
          </TailwindPreviewContext.Provider>
        </TailwindPlatformContext.Provider>
      </TailwindMediaContext.Provider>
    </TailwindStyleContext.Provider>
  );
}
