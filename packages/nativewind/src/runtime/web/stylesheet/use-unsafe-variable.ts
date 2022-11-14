import { useSyncExternalStore } from "use-sync-external-store/shim";
import { VariableValue } from "../../../transform-css/types";
import { UseUnsafeVariable } from "../../types/stylesheet";
import { setVariables, subscribeToVariable } from "./runtime";

let rootStyle: CSSStyleDeclaration | undefined;

export const useUnsafeVariable: UseUnsafeVariable = <T extends VariableValue>(
  name: `--${string}`,
  ssrValue?: T
): [T | undefined, (value: T) => void] => {
  const value = useSyncExternalStore(
    subscribeToVariable(name),
    () => {
      rootStyle ??= getComputedStyle(document.documentElement);
      return rootStyle.getPropertyValue(name) as T;
    },
    () => ssrValue
  );

  return [value, (value: T) => setVariables({ [name]: value })];
};
