import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Appearance, ColorSchemeName } from "react-native";

export interface ColorSchemeContext {
  colorScheme: ColorSchemeName;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
}

const ColorSchemeContext = createContext<ColorSchemeContext>({
  colorScheme: "light",
  setColorScheme: () => {
    return;
  },
});

export interface TailwindColorSchemeProviderProps {
  initialColorScheme: ColorSchemeName;
}

export function ColorSchemeProvider({
  initialColorScheme,
  ...props
}: PropsWithChildren<TailwindColorSchemeProviderProps>) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    initialColorScheme ?? Appearance.getColorScheme() ?? "light"
  );

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
      }}
      {...props}
    />
  );
}

export function useColorScheme() {
  return useContext(ColorSchemeContext);
}
