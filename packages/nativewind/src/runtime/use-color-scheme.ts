import { colorSchemeKey } from "./common";
import { NativeWindStyleSheet, useUnsafeVariable } from ".";

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useUnsafeVariable(colorSchemeKey);
  return {
    toggleColorScheme: NativeWindStyleSheet.toggleColorScheme,
    setColorScheme,
    colorScheme: colorScheme as string,
  };
}
