/* eslint-disable unicorn/no-array-for-each */
import { Dimensions, I18nManager } from "react-native";

import context from "./context";
import { setDimensions } from "./dimensions";
import { setDirection } from "./i18n";
import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";
import { create } from "./create";
import { Atom } from "../transform-css/types";

export const NativeWindStyleSheet = {
  create,
  reset,
  getColorScheme,
  setColorScheme,
  setDirection,
  toggleColorScheme,
  setVariables,
  setDimensions,
  isPreprocessed: () => context.preprocessed,
  setDangerouslyCompileStyles: context.setDangerouslyCompileStyles,
};

function reset() {
  context.reset();
  setDimensions(Dimensions);
  setDirection(I18nManager.isRTL ? "rtl" : "ltr");
}

const componentListeners = new Set<() => void>();
const styleSet = new Map<string, Set<string>>();

function createStyleSet(
  target: Record<string | symbol, Atom>,
  property: string
) {
  target[property] = {};
  for (const prop of property.split(/\w+/)) {
    Object.assign(target[property], styleRecord[prop]);
  }
}

export const styleRecord = new Proxy<Record<string | symbol, Atom>>(
  {},
  {
    get(target, property) {
      if (target[property] || typeof property === "symbol") {
        return target[property];
      }

      if (property.includes(" ")) {
        createStyleSet(target, property);

        for (const prop of property.split(/\w+/)) {
          let existing = styleSet.get(prop);
          if (!existing) {
            existing = new Set();
            styleSet.set(prop, existing);
          }
          existing.add(property);
        }
      }
    },
    set(target, property, newValue) {
      target[property] = newValue;

      if (typeof property === "symbol") return true;

      componentListeners.forEach((l) => l());

      styleSet.get(property)?.forEach((styleSet) => {
        createStyleSet(target, styleSet);
      });

      return true;
    },
  }
);

export function stylesChanged(onStoreChange: () => void) {
  componentListeners.add(onStoreChange);
  return () => componentListeners.delete(onStoreChange);
}

function setVariables(properties: Record<`--${string}`, string | number>) {
  context.setTopics(properties);

  if (typeof document !== "undefined") {
    for (const [key, value] of Object.entries(properties)) {
      document.documentElement.style.setProperty(key, value.toString());
    }
  }
}

NativeWindStyleSheet.reset();
