/* eslint-disable unicorn/no-array-for-each */
import { VariableValue } from "../../transform-css/types";

const variableSubscriptions = new Map<string, Set<() => void>>();

let rootStyle: CSSStyleDeclaration;
export function getVariable(name: `--${string}`) {
  if (typeof window !== undefined) {
    rootStyle ??= getComputedStyle(document.documentElement);
    return rootStyle.getPropertyValue(name);
  }
}

export function setVariables(properties: Record<`--${string}`, VariableValue>) {
  const subscriptions = new Set<() => void>();

  for (const [name, value] of Object.entries(properties)) {
    variableSubscriptions.get(name)?.forEach((callback) => {
      subscriptions.add(callback);
    });
    document.documentElement.style.setProperty(name, value.toString());
  }
}

export function subscribeToVariable(name: string) {
  return (callback: () => void) => {
    let set = variableSubscriptions.get(name);
    if (!set) {
      set = new Set();
      variableSubscriptions.set(name, set);
    }
    set.add(callback);
    return () => set?.delete(callback);
  };
}

export function resetRuntime() {
  variableSubscriptions.clear();
}
