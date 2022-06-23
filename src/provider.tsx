import React, { useMemo } from "react";
import { PropsWithChildren } from "react";
import { StyleSheet, Platform } from "react-native";

import {
  StoreContext,
  StyleSheetStore,
  ColorSchemeSystem,
  StyleSheetStoreConstructor,
} from "./style-sheet-store";

export interface TailwindProviderProps
  extends Omit<StyleSheetStoreConstructor, "colorScheme" | "preprocessed"> {
  initialColorScheme?: ColorSchemeSystem;
  platform?: typeof Platform.OS;
  webOutput?: "css" | "native";
  nativeOutput?: "css" | "native";
}

export function TailwindProvider({
  initialColorScheme,
  children,
  platform,
  dimensions,
  appearance,
  styles,
  atRules,
  topics,
  masks,
  childClasses,
  nativeOutput = "native",
  webOutput = typeof StyleSheet.create({ test: {} }).test === "number"
    ? "native"
    : "css",
  dangerouslyCompileStyles,
}: PropsWithChildren<TailwindProviderProps>) {
  const output = Platform.select({
    web: webOutput,
    native: nativeOutput,
    default: "native",
  });

  const store = useMemo(() => {
    return new StyleSheetStore({
      platform,
      dimensions,
      appearance,
      styles,
      atRules,
      topics,
      masks,
      childClasses,
      preprocessed: output === "css",
      colorScheme: initialColorScheme,
      dangerouslyCompileStyles,
    });
  }, [
    platform,
    dimensions,
    appearance,
    styles,
    atRules,
    topics,
    masks,
    childClasses,
  ]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}
