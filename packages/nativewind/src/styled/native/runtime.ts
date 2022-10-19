/* eslint-disable unicorn/no-array-for-each */
import { Appearance, ColorSchemeName, Platform } from "react-native";
import { resolve } from "../../style-sheet/native/resolve";
import {
  Atom,
  AtomRecord,
  Style,
  VariableValue,
} from "../../transform-css/types";

type ComputedAtom = Atom & { computedStyle: Style; recompute: () => Style };

const styleSets = new Map<string, Style>();
const childClassMap = new Map<string, string[]>();
const componentListeners = new Set<() => void>();

const emptyStyles = {};
export const atoms = new Map<string, ComputedAtom>();
const atomDependents = new Map<string, Set<string>>();

export const variables = new Map<string, VariableValue>();
const variableSubscriptions = new Map<string, Set<() => void>>();
let rootVariableValues: Record<string, VariableValue> = {};
let darkRootVariableValues: Record<string, VariableValue> = {};

export function create(atomRecord: AtomRecord) {
  for (const [name, atom] of Object.entries(atomRecord)) {
    if (name === ":root") {
      if (atom.variables) {
        rootVariableValues = atom.variables[0];

        if (rootVariableValues["--dark-mode"] !== "class") {
          rootVariableValues["--color-scheme"] =
            Appearance.getColorScheme() ?? "light";
          rootVariableValues["--color-scheme-system"] = "system";
        }

        setVariables(rootVariableValues);
      }
    } else if (name === "dark" || name === ":root[dark]") {
      if (atom.variables) {
        darkRootVariableValues = {
          ...darkRootVariableValues,
          ...atom.variables[0],
        };
      }
    } else {
      setAtom(name, atom);
    }
  }
}

export function getStyleSet(styleSet: string) {
  let style = styleSets.get(styleSet);

  if (style) {
    return style;
  }

  const childClasses = [];

  for (const atom of styleSet.split(/\s+/)) {
    let dependentSet = atomDependents.get(atom);

    const atomChildClasses = atoms.get(atom)?.childClasses;
    if (atomChildClasses) childClasses.push(...atomChildClasses);

    if (!dependentSet) {
      dependentSet = new Set();
      atomDependents.set(atom, dependentSet);
    }
    dependentSet.add(styleSet);
  }

  childClassMap.set(styleSet, childClasses);
  style = updateStyleSet(styleSet);

  return style;
}

function updateStyleSet(styleSet: string) {
  const newStyle = {};

  for (const atomName of styleSet.split(/\s+/)) {
    Object.assign(newStyle, getAtomStyle(atomName));
  }

  styleSets.set(styleSet, newStyle);
  return newStyle;
}
export function getChildClasses(styleSet: string) {
  return childClassMap.get(styleSet) ?? [];
}

function getAtomStyle(atomName: string) {
  const atom = atoms.get(atomName);

  if (!atom) return;

  let { computedStyle } = atom;

  if (!computedStyle) {
    computedStyle = atom.recompute();
  }

  return computedStyle;
}

export function setAtom(name: string, atom: Atom) {
  const computedAtom = atom as ComputedAtom;

  computedAtom.recompute = () => {
    if (!atom.styles || atom.styles.length === 0) {
      computedAtom.computedStyle = emptyStyles;
      return emptyStyles;
    }

    // First time setup
    if (!computedAtom.computedStyle && atom.topics) {
      for (const topic of atom.topics) {
        let set = variableSubscriptions.get(topic);
        if (!set) {
          set = new Set();
          variableSubscriptions.set(topic, set);
        }
        set.add(computedAtom.recompute);
      }
    }

    const computedStyle: Style = {};

    for (const [index, styles] of atom.styles.entries()) {
      const atRules = atom.atRules?.[index];

      let atRuleConditionsMet = true;

      if (atRules && atRules.length === 0) {
        atRuleConditionsMet = atRules.every(([rule, params]) => {
          switch (rule) {
            case "colorScheme":
              return variables.get("colorScheme") === params;
            case "platform":
              return params === Platform.OS;
            case "width":
              return params === resolve(variables.get("--window-width"));
            case "min-width": {
              const value = resolve(variables.get("--window-width"));
              if (typeof value !== "number") return false;
              return (params ?? 0) >= value;
            }
            case "max-width": {
              const value = resolve(variables.get("--window-width"));
              if (typeof value !== "number") return false;
              return (params ?? 0) <= value;
            }
            case "height":
              return params === resolve(variables.get("--window-height"));
            case "min-height": {
              const value = resolve(variables.get("--window-height"));
              if (typeof value !== "number") return false;
              return (params ?? 0) >= value;
            }
            case "max-height": {
              const value = resolve(variables.get("--window-height"));
              if (typeof value !== "number") return false;
              return (params ?? 0) <= value;
            }
            default:
              return true;
          }
        });
      }

      if (!atRuleConditionsMet) continue;

      for (const [key, value] of Object.entries(styles)) {
        (computedStyle as Record<string, unknown>)[key] = resolve(
          value as VariableValue
        );
      }
    }

    computedAtom.computedStyle = computedStyle;

    atomDependents.get(name)?.forEach((dependent) => {
      updateStyleSet(dependent);
    });

    return computedStyle;
  };

  atoms.set(name, computedAtom);
}

export function setVariables(properties: Record<`--${string}`, VariableValue>) {
  const subscriptions = new Set<() => void>();

  for (const [name, value] of Object.entries(properties)) {
    if (value === variables.get(name)) continue;

    variables.set(name, value);

    variableSubscriptions.get(name)?.forEach((callback) => {
      subscriptions.add(callback);
    });
  }

  subscriptions.forEach((callback) => callback());
  componentListeners.forEach((l) => l());
}

export function getVariablesForColorScheme(
  colorScheme: NonNullable<ColorSchemeName>
) {
  return colorScheme === "light" ? rootVariableValues : darkRootVariableValues;
}

export function subscribeToStyleSheet(callback: () => void) {
  componentListeners.add(callback);
  return () => componentListeners.delete(callback);
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
  componentListeners.clear();
  variableSubscriptions.clear();

  atomDependents.clear();
  styleSets.clear();
  atoms.clear();
  variables.clear();
  rootVariableValues = {};
  darkRootVariableValues = {};

  setVariables({
    "--platform": Platform.OS,
    "--rem": 16,
    "--color-scheme": Appearance.getColorScheme() ?? "light",
    "--color-scheme-system": "system",
  });
  atoms.set("group", {
    computedStyle: emptyStyles,
    recompute: () => emptyStyles,
    meta: {
      group: true,
    },
  });
  atoms.set("scoped-group", {
    computedStyle: emptyStyles,
    recompute: () => emptyStyles,
    meta: {
      group: true,
    },
  });
  atoms.set("parent", {
    computedStyle: emptyStyles,
    recompute: () => emptyStyles,
    meta: {
      group: true,
    },
  });
}
