import { PropsWithChildren, useState } from "react";
import { ColorSchemeName, Appearance } from "react-native";

import {
  MediaRules,
  StyleRecord,
  TailwindColorSchemeContext,
  TailwindMediaContext,
  TailwindPlatformContext,
  TailwindSetColorSchemeContext,
  TailwindStyleContext,
} from "./context";

export interface TailwindProviderProps {
  styles?: StyleRecord;
  media?: MediaRules;
  colorScheme?: ColorSchemeName;
}

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media,
  colorScheme: overrideColorScheme,
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    overrideColorScheme ?? Appearance.getColorScheme() ?? "light"
  );

  return (
    <TailwindStyleContext.Provider value={styles}>
      <TailwindMediaContext.Provider value={media}>
        <TailwindPlatformContext.Provider value="native">
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
