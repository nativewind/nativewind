import { useState } from "react";
import { colorScheme } from "./color-scheme";
import { Effect } from "../observable";
export function useColorScheme() {
  const [effect, setEffect] = useState<Effect>(() => ({
    run: () => setEffect((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  return {
    colorScheme: colorScheme.get(effect),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  };
}
