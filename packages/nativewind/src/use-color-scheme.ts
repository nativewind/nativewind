import { NativeWindStyleSheet } from "./style-sheet";

export function useColorScheme() {
  return {
    setColorScheme: NativeWindStyleSheet.setColorScheme,
    toggleColorScheme: NativeWindStyleSheet.toggleColorScheme,
    colorScheme: NativeWindStyleSheet.getColorScheme(),
  };
}
