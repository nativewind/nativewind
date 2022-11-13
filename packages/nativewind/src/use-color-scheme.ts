import { colorSchemeKey } from "./runtime/common";
import { NativeWindStyleSheet, useUnsafeVariable } from "./runtime";

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useUnsafeVariable(colorSchemeKey);
  return {
    toggleColorScheme: NativeWindStyleSheet.toggleColorScheme,
    setColorScheme,
    colorScheme,
  };
}
