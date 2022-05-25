import React, { PropsWithChildren, useState } from "react";
import {
  useWindowDimensions,
  ColorSchemeName,
  Appearance,
  Platform,
} from "react-native";

import { useDeviceOrientation } from "@react-native-community/hooks";

import { TailwindContext } from "./context";

export interface TailwindProviderProps {
  styles?: typeof globalThis["tailwindcss_react_native_style"];
  media?: typeof globalThis["tailwindcss_react_native_media"];
  colorScheme?: ColorSchemeName;
  platform?: typeof Platform.OS | "native";
  preview?: boolean;
}

export function TailwindProvider({
  styles = globalThis.tailwindcss_react_native_style,
  media = globalThis.tailwindcss_react_native_media ?? {},
  colorScheme: overrideColorScheme,
  platform = Platform.OS,
  preview = false,
  children,
}: PropsWithChildren<TailwindProviderProps>) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    overrideColorScheme ?? Appearance.getColorScheme() ?? "light"
  );

  // const { reduceMotionEnabled: reduceMotion } = useAccessibilityInfo() // We should support this
  const { width, height } = useWindowDimensions();
  const orientation: TailwindContext["orientation"] = useDeviceOrientation()
    .portrait
    ? "portrait"
    : "landscape";

  return (
    <TailwindContext.Provider
      value={{
        styles,
        media,
        colorScheme: overrideColorScheme || colorScheme,
        setColorScheme,
        width,
        height,
        orientation,
        platform,
        preview,
      }}
    >
      {children}
    </TailwindContext.Provider>
  );
}
