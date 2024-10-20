import { useState } from "react";

import { Effect } from "../observable";
import { colorScheme } from "./color-scheme";

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
