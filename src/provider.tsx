import { PropsWithChildren, useState } from "react";
import { ColorSchemeName, Appearance } from "react-native";

import {
  TailwindStyleContext,
  TailwindColorSchemeContext,
  TailwindSetColorSchemeContext,
  StyleRecord,
  MediaRules,
} from "./context";

export interface TailwindProviderProps {
  styles?: StyleRecord;
  media?: MediaRules;
  colorScheme?: ColorSchemeName;
}

export function TailwindProvider({
  styles = {},
  media = {},
  colorScheme: overrideColorScheme,
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  // Save into state, as this will never change
  const [styleValue] = useState<TailwindStyleContext>({ media, styles });
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme() ?? "light"
  );

  return (
    <TailwindStyleContext.Provider value={styleValue}>
      <TailwindColorSchemeContext.Provider
        value={overrideColorScheme || colorScheme}
      >
        <TailwindSetColorSchemeContext.Provider value={setColorScheme}>
          {children}
        </TailwindSetColorSchemeContext.Provider>
      </TailwindColorSchemeContext.Provider>
    </TailwindStyleContext.Provider>
  );
}
