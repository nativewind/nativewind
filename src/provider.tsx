import * as React from "react";
import { PropsWithChildren } from "react";
import { ColorSchemeName, Platform } from "react-native";

import { PlatformProvider } from "./context/platform";
import { ColorSchemeProvider } from "./context/color-scheme";
import { DeviceMediaProvider } from "./context/device-media";

import { StyleSheetContext } from "./context/style-sheet";

export interface TailwindProviderProps {
  styles?: typeof globalThis["tailwindcss_react_native_style"];
  media?: typeof globalThis["tailwindcss_react_native_media"];
  initialColorScheme?: ColorSchemeName;
  platform?: typeof Platform.OS | "native";
  preview?: boolean;
}

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media ?? {},
  initialColorScheme,
  preview,
  platform,
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  const stylesheet = { styles, media };
  return (
    <PlatformProvider preview={preview} platform={platform}>
      <ColorSchemeProvider initialColorScheme={initialColorScheme}>
        <StyleSheetContext.Provider value={stylesheet}>
          <DeviceMediaProvider>{children}</DeviceMediaProvider>
        </StyleSheetContext.Provider>
      </ColorSchemeProvider>
    </PlatformProvider>
  );
}
