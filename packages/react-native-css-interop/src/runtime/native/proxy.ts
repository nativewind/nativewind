import { createContext, useContext } from "react";
import {
  ContainerRuntime,
  ExtractedStyleValue,
  Interaction,
} from "../../types";
import { createSignal, Signal, useSignals } from "../signals";
import { colorScheme } from "./color-scheme";

function createColorSchemeSignal<T = ExtractedStyleValue>(
  lightValue: T | undefined = undefined,
  darkValue = lightValue,
) {
  let light = createSignal(lightValue);
  let dark = createSignal(darkValue);

  const get = () => {
    return colorScheme.get() === "light" ? light.get() : dark.get();
  };

  // Set the value and unsubscribe from the parent if the value is not undefined.
  const set = (nextValue: T) => {
    colorScheme.get() === "light" ? light.set(nextValue) : dark.set(nextValue);
  };

  const unsubscribe = (subscription: () => void) => {
    light.unsubscribe(subscription);
    dark.unsubscribe(subscription);
  };

  return {
    get,
    set,
    setLight: light.set,
    setDark: dark.set,
    unsubscribe,
  };
}

export type ColorSchemeSignal = ReturnType<typeof createColorSchemeSignal>;

export const rootComponentContext: RootComponentContext = {
  variables: {},
  containers: {},
  interaction: {} as Interaction,
};

const defaultVariables: Record<string, ColorSchemeSignal> = {};

export function setRootVariable(name: string, value: any, scheme = "light") {
  if (!rootComponentContext.variables[name]) {
    rootComponentContext.variables[name] = createColorSchemeSignal();
  }
  scheme === "light"
    ? rootComponentContext.variables[name].setLight(value)
    : rootComponentContext.variables[name].setDark(value);
}

export function setDefaultVariable(name: string, value: any, scheme = "light") {
  if (!defaultVariables[name]) {
    defaultVariables[name] = createColorSchemeSignal();
  }
  scheme === "light"
    ? defaultVariables[name].setLight(value)
    : defaultVariables[name].setDark(value);
}

export function createInheritableSignal<T = ExtractedStyleValue>(
  value: T | undefined,
  parent?: Signal<T>,
) {
  let signal = createSignal(value);

  const inheritableSignal = {
    ...signal,
    get() {
      return signal.get() ?? parent?.get();
    },
    set(nextValue: T | undefined) {
      if (nextValue !== undefined && signal.peek() === undefined) {
        if (parent) {
          for (const subscription of signal.subscriptions) {
            parent.unsubscribe(subscription);
          }
        }
      }
      signal.set(nextValue);
    },
    unsubscribe(callback: () => void) {
      signal.unsubscribe(callback);
      if (parent) {
        parent.unsubscribe(callback);
      }
    },
  };

  return inheritableSignal;
}

export function createCSSVariableSignal<T = ExtractedStyleValue>(
  key: string,
  value: T | undefined,
  parent: ComponentContext,
) {
  let signal = createSignal(value);

  const inheritableSignal = {
    ...signal,
    get() {
      return (
        signal.get() ??
        defaultVariables[key]?.get() ??
        parent.variables[key]?.get()
      );
    },
    set(nextValue: T | undefined) {
      if (nextValue !== undefined && signal.peek() === undefined) {
        for (const subscription of signal.subscriptions) {
          defaultVariables[key]?.unsubscribe(subscription);
          parent.variables[key]?.unsubscribe(subscription);
        }
      }
      signal.set(nextValue);
    },
  };

  return inheritableSignal;
}

export const componentContext = createContext(rootComponentContext);
export const ComponentContextProvider = componentContext.Provider;

export interface ComponentContext {
  variables: Record<
    string,
    ColorSchemeSignal | Signal<ExtractedStyleValue | undefined>
  >;
  containers: Record<string, Signal<ContainerRuntime>>;
  interaction: Interaction;
}

interface RootComponentContext {
  variables: Record<string, ColorSchemeSignal>;
  containers: Record<string, Signal<ContainerRuntime>>;
  interaction: Interaction;
}

export const useUnstableNativeVariable = (name: string) => {
  useSignals();
  const inheritedContext = useContext(componentContext);
  return inheritedContext.variables[name].get();
};

export function createComponentContext(inheritedContext: ComponentContext) {
  return {
    containers: createContainerProxy(inheritedContext),
    variables: createVariableProxy(inheritedContext),
    interaction: createInteractionProxy(),
  };
}

export function createContainerProxy(inheritedContext: ComponentContext) {
  return new Proxy({} as Record<string, Signal<ExtractedStyleValue>>, {
    get: function (target: any, prop: string) {
      if (!target[prop]) {
        target[prop] = createInheritableSignal(
          undefined,
          inheritedContext.containers[prop],
        );
      }

      return target[prop];
    },
  });
}
export function createVariableProxy(inheritedContext: ComponentContext) {
  return new Proxy({} as Record<string, Signal<ExtractedStyleValue>>, {
    get: function (target: any, prop: string) {
      if (!target[prop]) {
        target[prop] = createCSSVariableSignal(
          prop,
          undefined,
          inheritedContext,
        );
      }

      return target[prop];
    },
  });
}

function createInteractionProxy() {
  return new Proxy({} as Interaction, {
    get: function (target: any, prop: keyof Interaction, receiver) {
      if (!target[prop]) {
        if (prop === "layoutHeight" || prop === "layoutWidth") {
          target[prop] = createSignal(0);
        } else {
          target[prop] = createSignal(false);
        }
      }

      return target[prop];
    },
  });
}
