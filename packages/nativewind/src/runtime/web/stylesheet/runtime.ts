import { VariableValue } from "../../../transform-css/types";

const variableSubscriptions = new Map<string, Set<() => void>>();
const variables = new Map<string, VariableValue>();

export function getVariable(name: `--${string}`) {
  return variables.get(name);
}

export function getSSRStyles() {
  return { "font-size": "--rem", ...Object.fromEntries(variables) };
}

export function setVariables(properties: Record<`--${string}`, VariableValue>) {
  for (const [name, value] of Object.entries(properties)) {
    // eslint-disable-next-line unicorn/no-array-for-each
    variableSubscriptions.get(name)?.forEach((callback) => {
      callback();
    });

    variables.set(name, value);

    if (typeof document !== undefined) {
      document.documentElement.style.setProperty(name, value.toString());
    }
  }
}

setVariables({ "--rem": "16px" });

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
