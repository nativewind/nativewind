import { createContext } from "react";
import { Appearance } from "react-native";

import { StyleRuleSetSymbol, StyleRuleSymbol } from "../../shared";
import type {
  ExtractedAnimation,
  RemappedClassName,
  RuntimeValue,
  StyleRuleSet,
  StyleSheetRegisterCompiledOptions,
} from "../../types";
import { Effect, Observable, observable } from "../observable";
import {
  colorScheme,
  cssVariableObservable,
  isReduceMotionEnabled,
} from "./appearance-observables";
import { flags, warnings } from "./globals";
import { INTERNAL_RESET, rem } from "./unit-observables";

export type InjectedStyleContextValue = {
  styles: Record<string, Observable<StyleRuleSet>>;
  animations: Record<string, ExtractedAnimation>;
  universalVariables: VariableContextValue;
};

export type VariableContextValue =
  | Map<
      string,
      ReturnType<typeof cssVariableObservable> | number | string | RuntimeValue
    >
  | Record<
      string,
      ReturnType<typeof cssVariableObservable> | number | string | RuntimeValue
    >;

declare global {
  var __css_interop: {
    styles: Map<string, Observable<StyleRuleSet | undefined>>;
    keyframes: Map<string, Observable<ExtractedAnimation | undefined>>;
    rootVariables: Map<string, ReturnType<typeof cssVariableObservable>>;
    universalVariables: Map<string, ReturnType<typeof cssVariableObservable>>;
  };
}

global.__css_interop ??= {
  styles: new Map(),
  keyframes: new Map(),
  rootVariables: new Map(),
  universalVariables: new Map(),
};

const styles = global.__css_interop.styles;
const keyframes = global.__css_interop.keyframes;
const rootVariables = global.__css_interop.rootVariables;
const universalVariables = global.__css_interop.universalVariables;

const seenStylesForHotReload = new Set<string>();

export const opaqueStyles = new WeakMap<
  object,
  RemappedClassName | StyleRuleSet
>();

export const VariableContext =
  createContext<VariableContextValue>(rootVariables);

export function getStyle(name: string, effect?: Effect) {
  if (!seenStylesForHotReload.has(name)) {
    // This is the first time seeing the style, so we need to initiate it
    seenStylesForHotReload.add(name);
    initiateStyle(name);
  }

  let obs = styles.get(name);
  if (!obs) styles.set(name, (obs = observable(undefined)));
  const style = obs.get(effect);

  const styleWarnings = style?.warnings;

  if (styleWarnings) {
    if (!warnings.has(name)) {
      warnings.set(name, styleWarnings);
    }
  }

  return style;
}

export function getOpaqueStyles(
  style: Record<string, any>,
  effect?: Effect,
): (StyleRuleSet | Record<string, any> | void)[] {
  const opaqueStyle = opaqueStyles.get(style);

  if (!opaqueStyle) {
    return [style];
  }

  if (opaqueStyle[StyleRuleSetSymbol] === "RemappedClassName") {
    return opaqueStyle.classNames.map((className) => {
      return getStyle(className, effect);
    });
  } else if (opaqueStyle) {
    return [opaqueStyle];
  }

  return [];
}

export function getAnimation(name: string, effect: Effect) {
  let obs = keyframes.get(name);
  if (!obs) keyframes.set(name, (obs = observable(undefined)));
  return obs.get(effect);
}
export function getVariable(
  name: string,
  store?: VariableContextValue,
  effect?: Effect,
) {
  if (!store) return;

  let obs = store instanceof Map ? store.get(name) : store[name];
  return obs && typeof obs === "object" && "get" in obs ? obs.get(effect) : obs;
}

export const getUniversalVariable = (name: string, effect: Effect) => {
  return getVariable(name, universalVariables, effect);
};

export function resetData() {
  styles.clear();
  seenStylesForHotReload.clear();
  keyframes.clear();
  warnings.clear();
  universalVariables.clear();
  rootVariables.clear();
  colorScheme[INTERNAL_RESET](Appearance);
  isReduceMotionEnabled[INTERNAL_RESET]();
  rem.set(14);
}

let rules: NonNullable<StyleSheetRegisterCompiledOptions["rules"]> = {};

export function injectData(data: StyleSheetRegisterCompiledOptions) {
  if (data.rules) {
    Object.assign(rules, data.rules);
  }

  for (const style of seenStylesForHotReload) {
    initiateStyle(style);
  }

  if (data.keyframes) {
    for (const entry of data.keyframes) {
      const value = keyframes.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        keyframes.set(entry[0], observable(entry[1]));
      }
    }
  }

  if (data.rootVariables) {
    for (const entry of Object.entries(data.rootVariables)) {
      const value = rootVariables.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        rootVariables.set(
          entry[0],
          cssVariableObservable(entry[1], { name: entry[0] }),
        );
      }
    }
  }

  if (data.universalVariables) {
    for (const entry of Object.entries(data.universalVariables)) {
      const value = universalVariables.get(entry[0]);
      if (value) {
        value.set(entry[1]);
      } else {
        universalVariables.set(entry[0], cssVariableObservable(entry[1]));
      }
    }
  }

  flags.set("enabled", "true");
  if (data.flags) {
    for (const [key, value] of Object.entries(data.flags)) {
      flags.set(key, value);
    }
  }

  if (data.rem) {
    rem.set(data.rem);
  }
}

function initiateStyle(name: string) {
  const value = styles.get(name);
  const style = rules[name];

  if (!style) return;

  // Add the symbols that were removed during the Metro->Device transfer
  style[StyleRuleSetSymbol] = true;
  style.n?.forEach((style) => {
    style[StyleRuleSymbol] = true;
  });
  style.i?.forEach((style) => {
    style[StyleRuleSymbol] = true;
  });

  if (value) {
    value.set(style);
  } else {
    styles.set(name, observable(style));
  }
}
