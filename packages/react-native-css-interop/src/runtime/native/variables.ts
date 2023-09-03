import { createContext, useContext, useReducer } from "react";
import { createSignal, useComputation } from "../signals";
import { OpaqueStyleToken, opaqueStyles, styleMetaMap } from "./misc";
import { StyleProp } from "../../types";

export const rootVariables = createSignal<Record<string, unknown>>({});
export const defaultVariables = createSignal<Record<string, unknown>>({});
export const VariableContext = createContext<Record<string, unknown> | null>(
  null,
);

let variables = {
  rootVariables: {} as Record<string, unknown>,
  rootDarkVariables: {} as Record<string, unknown>,
  defaultVariables: {} as Record<string, unknown>,
  defaultDarkVariables: {} as Record<string, unknown>,
};

export function getVariables() {
  return variables;
}

export function resetVariables() {
  rootVariables.set({});
  defaultVariables.set({});
  variables = {
    rootVariables: {},
    rootDarkVariables: {},
    defaultVariables: {},
    defaultDarkVariables: {},
  };
}

export const useUnstableNativeVariables = () => {
  return useNativeVariables(useRerender());
};

export const useNativeVariables = (rerender: () => void) => {
  const variables = useContext(VariableContext);
  return useComputation(
    () => {
      // $variables will be null if this is a top-level component
      if (variables === null) {
        return rootVariables.get();
      } else {
        return {
          ...variables,
          ...defaultVariables.get(),
        };
      }
    },
    [variables],
    rerender,
  );
};

export function resetRootVariables(currentColor: "light" | "dark") {
  if (currentColor === "light") {
    rootVariables.set({
      ...variables.rootVariables,
      ...variables.defaultVariables,
    });
  } else {
    rootVariables.set({
      ...variables.rootVariables,
      ...variables.rootDarkVariables,
      ...variables.defaultVariables,
      ...variables.defaultDarkVariables,
    });
  }
}

export function resetDefaultVariables(currentColor: "light" | "dark") {
  if (currentColor === "light") {
    defaultVariables.set(variables.defaultVariables);
  } else {
    defaultVariables.set({
      ...variables.defaultVariables,
      ...variables.defaultDarkVariables,
    });
  }
}

export function vars(variables: Record<string, string | number>) {
  // Create an empty style prop with meta
  const styleProp = {};

  const $variables: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(variables)) {
    if (key.startsWith("--")) {
      $variables[key] = value;
    } else {
      $variables[`--${key}`] = value;
    }
  }
  styleMetaMap.set(styleProp, { variables: $variables });

  // Assign it an OpaqueStyleToken
  const opaqueStyle = new OpaqueStyleToken();
  opaqueStyles.set(opaqueStyle, styleProp);

  return opaqueStyle as StyleProp;
}

export const useRerender = () => useReducer(rerenderReducer, 0)[1];
const rerenderReducer = (accumulator: number) => accumulator + 1;
