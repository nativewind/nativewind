import { useRef } from "react";
import { ColorValue } from "react-native";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { setVariables, subscribeToVariable } from "./runtime";

let rootStyle: CSSStyleDeclaration | undefined;

export const useUnsafeVariable = <T extends string | number | ColorValue>(
  name: `--${string}`,
  ssrValue?: T
): [T | undefined, (value: T) => void] => {
  const setVariable = useRef((value: T) => setVariables({ [name]: value }));
  const value = useSyncExternalStore(
    subscribeToVariable(name),
    () => {
      rootStyle ??= getComputedStyle(document.documentElement);
      return rootStyle.getPropertyValue(name) as T;
    },
    () => ssrValue
  );

  return [value, setVariable.current];
};
