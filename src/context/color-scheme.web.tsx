import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { Appearance, ColorSchemeName } from "react-native";
import { usePlatform } from "./platform";

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
  const { preview } = usePlatform();
  const [colorScheme, setColorSchemeState] = useState<ColorSchemeName>(() => {
    const value = initialColorScheme ?? Appearance.getColorScheme() ?? "light";

    if (preview) document.body.classList.add(value);

    return value;
  });

  const setColorScheme = useCallback(
    (value: ColorSchemeName) => {
      setColorSchemeState(value);

      if (preview && colorScheme !== value) {
        document.body.classList.remove(colorScheme);
        document.body.classList.add("modal-open");
      }
    },
    [setColorSchemeState]
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
