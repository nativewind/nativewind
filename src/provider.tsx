import React, { useMemo } from "react";
import { PropsWithChildren } from "react";
import { ColorSchemeName, Platform } from "react-native";

import { StoreContext, StyleSheetStore } from "./style-sheet-store";

export interface TailwindProviderProps {
  styles?: typeof globalThis["tailwindcss_react_native_style"];
  media?: typeof globalThis["tailwindcss_react_native_media"];
  initialColorScheme?: ColorSchemeName;
  platform?: typeof Platform.OS | "native";
  webOutput?: "css" | "native";
  nativeOutput?: "css" | "native";
}

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media ?? {},
  initialColorScheme,
  webOutput,
  nativeOutput = "native",
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  const output = Platform.select({
    web: webOutput,
    native: nativeOutput,
    default: "native",
  });

  const store = useMemo(() => {
    return new StyleSheetStore({
      styles,
      atRules: media,
      preprocessed: output === "css",
      colorScheme: initialColorScheme,
    });
  }, [styles, media]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
