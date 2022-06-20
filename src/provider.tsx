import React, { useMemo } from "react";
import { PropsWithChildren } from "react";
import { StyleSheet, Platform } from "react-native";

import {
  StoreContext,
  StyleSheetStore,
  ColorSchemeSystem,
} from "./style-sheet-store";

export interface TailwindProviderProps {
  styles?: typeof globalThis["tailwindcss_react_native_style"];
  media?: typeof globalThis["tailwindcss_react_native_media"];
  initialColorScheme?: ColorSchemeSystem;
  platform?: typeof Platform.OS | "native";
  webOutput?: "css" | "native";
  nativeOutput?: "css" | "native";
}

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media ?? {},
  initialColorScheme,
  nativeOutput = "native",
  webOutput = typeof StyleSheet.create({ test: {} }).test === "number"
    ? "native"
    : "css",
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
