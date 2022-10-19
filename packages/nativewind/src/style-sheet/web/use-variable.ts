import { useRef } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { VariableValue } from "../../transform-css/types";
import { setVariables, subscribeToVariable } from "./runtime";

const rootStyle = getComputedStyle(document.documentElement);

export const useVariable = <T extends VariableValue>(
  name: `--${string}`
): [T, (value: T) => void] => {
  const setVariable = useRef((value: T) => setVariables({ [name]: value }));
  const value = useSyncExternalStore(
    subscribeToVariable(name),
    () => rootStyle.getPropertyValue(name),
    // eslint-disable-next-line unicorn/no-useless-undefined
    () => undefined
  );

  return [value as T, setVariable.current];
};
