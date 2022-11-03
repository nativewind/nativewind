import { useSyncExternalStore } from "use-sync-external-store/shim";
import { VariableValue } from "../../transform-css/types";
import { resolve } from "./resolve";
import { setVariables, subscribeToVariable, variables } from "./runtime";

export const useUnsafeVariable = <T extends VariableValue>(
  name: `--${string}`
): [T, (value: T) => void] => {
  const setVariable = (value: T) => setVariables({ [name]: value });
  const value = useSyncExternalStore(
    subscribeToVariable(name),
    () => resolve(variables.get(name)),
    () => resolve(variables.get(name))
  );

  return [value as T, setVariable];
};
