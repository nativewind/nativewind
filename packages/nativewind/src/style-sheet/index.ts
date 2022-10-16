/* eslint-disable unicorn/no-array-for-each */
import { Dimensions, I18nManager, Platform } from "react-native";

import context from "./context";
import { setDimensions } from "./dimensions";
import { setDirection } from "./i18n";
import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";
import { create } from "./create";
import { Atom, Style, VariableValue } from "../transform-css/types";
import { resolve } from "./resolve";

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
const atomDependents = new Map<string, Set<string>>();
const variableDependents = new Map<string, Set<string>>();

export const styleSets = new Proxy<Record<string | symbol, Style>>(
  {},
  {
    get(target, styleSet) {
      if (target[styleSet] || typeof styleSet === "symbol") {
        return target[styleSet];
      }

      updateStyleSet(styleSet);

      for (const atom of styleSet.split(/\w+/)) {
        let dependentSet = atomDependents.get(atom);
        if (!dependentSet) {
          dependentSet = new Set();
          atomDependents.set(atom, dependentSet);
        }
        dependentSet.add(styleSet);
      }

      return target[styleSet];
    },
  }
);

export const atomRecord = new Proxy<
  Record<string | symbol, Atom & { flatStyle?: Style }>
>(
  {},
  {
    set(target, property, atom: Atom) {
      if (typeof property === "symbol") return false;

      // First time setup
      if (!target[property]) {
        if (atom.topics) {
          for (const topic of atom.topics) {
            let dependentSet = variableDependents.get(topic);
            if (!dependentSet) {
              dependentSet = new Set();
              atomDependents.set(topic, dependentSet);
            }
            dependentSet.add(property);
          }
        }

        if (atom.styles) {
          let flatStyle: Style = {};

          for (const [index, originalStyles] of atom.styles.entries()) {
            const styles = { ...originalStyles } as Style;

            for (const [key, value] of Object.entries(styles)) {
              (styles as Record<string, unknown>)[key] = resolve(value);
            }

            const atRules = atom.atRules?.[index];

            if (!atRules || atRules.length === 0) {
              flatStyle = { ...flatStyle, ...styles };
              continue;
            }

            const atRulesResult = atRules.every(([rule, params]) => {
              if (rule === "selector") {
                // These atRules shouldn't be on the atomic styles, they only
                // apply to childStyles
                return false;
              } else if (rule === "colorScheme") {
                return context.topics["colorScheme"] === params;
              } else {
                switch (rule) {
                  case "platform":
                    return params === Platform.OS;
                  case "width":
                    return params === resolve(context.topics["--window-width"]);
                  case "min-width": {
                    const value = resolve(context.topics["--window-width"]);
                    if (typeof value !== "number") return false;
                    return (params ?? 0) >= value;
                  }
                  case "max-width": {
                    const value = resolve(context.topics["--window-width"]);
                    if (typeof value !== "number") return false;
                    return (params ?? 0) <= value;
                  }
                  case "height":
                    return (
                      params === resolve(context.topics["--window-height"])
                    );
                  case "min-height": {
                    const value = resolve(context.topics["--window-height"]);
                    if (typeof value !== "number") return false;
                    return (params ?? 0) >= value;
                  }
                  case "max-height": {
                    const value = resolve(context.topics["--window-height"]);
                    if (typeof value !== "number") return false;
                    return (params ?? 0) <= value;
                  }
                  default:
                    return true;
                }
              }
            });

            if (atRulesResult) {
              // All atRules matches, so add the style
              flatStyle = { ...flatStyle, ...styles };

              // If there are children also add them.
              if (atom.childClasses) {
                // for (const child of atom.childClasses) {
                //   const childAtom = context.atoms.get(child);
                //   if (childAtom) {
                //     evaluate(child, childAtom);
                //   }
                // }
              }
            } else {
              // If we failed the atRulesResult, remove the child class styles
              // if (atom.childClasses) {
              //   for (const child of atom.childClasses) {
              //     newStyles[child] = undefined;
              //   }
              // }
            }
          }
        }
      }

      target[property] = atom;

      atomDependents.get(property)?.forEach((dependent) => {
        updateStyleSet(dependent);
      });
      updateComponents();

      return true;
    },
  }
);

export const variableRecord = new Proxy<Record<string | symbol, VariableValue>>(
  {},
  {
    set(target, property, newValue) {
      if (typeof property === "symbol") return false;

      target[property] = newValue;

      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty(
          property,
          newValue.toString()
        );
      }

      variableDependents.get(property)?.forEach((dependent) => {
        updateStyleSet(dependent);
      });

      return true;
    },
  }
);

const updateComponents = debounce(() => componentListeners.forEach((l) => l()));

function updateStyleSet(styleSet: string) {
  const newStyle = {};

  for (const prop of styleSet.split(/\w+/)) {
    Object.assign(newStyle, atomRecord[prop].styles);
  }

  styleSets[styleSet] = newStyle;
}

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

function debounce(function_: () => void, timeout = 300) {
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(function_, timeout);
  };
}

NativeWindStyleSheet.reset();
