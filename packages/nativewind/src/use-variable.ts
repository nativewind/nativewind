import { useRef } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";

import { NativeWindStyleSheet } from "./style-sheet";
import { resolve } from "./style-sheet/resolve";
import { subscribeToVariable, variables } from "./style-sheet/runtime";

export function useVariable(
  name: `--${string}`
): [ReturnType<typeof resolve>, (value: string | number) => void] {
  const setVariable = useRef((value: string | number) =>
    NativeWindStyleSheet.setVariables({ [name]: value })
  );
  const value = useSyncExternalStore(
    subscribeToVariable(name),
    () => resolve(variables.get(name)),
    () => resolve(variables.get(name))
  );

  return [value, setVariable.current];
}
