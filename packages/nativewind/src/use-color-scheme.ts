import { NativeWindStyleSheet, useUnsafeVariable } from "./style-sheet";
import { colorSchemeKey } from "./style-sheet/common";

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useUnsafeVariable(colorSchemeKey);
  return {
    toggleColorScheme: NativeWindStyleSheet.toggleColorScheme,
    setColorScheme,
    colorScheme,
  };
}
