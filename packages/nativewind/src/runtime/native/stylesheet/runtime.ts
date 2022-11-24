/* eslint-disable unicorn/no-array-for-each */
import {
  Appearance,
  Dimensions,
  ColorSchemeName,
  I18nManager,
  Platform,
  EmitterSubscription,
} from "react-native";
import {
  Atom,
  AtomRecord,
  Style,
  VariableValue,
} from "../../../transform-css/types";

import { getColorScheme } from "./color-scheme";
import { resolve } from "./resolve";

import {
  colorSchemeKey,
  colorSchemeSystemKey,
  darkModeKey,
  i18nDirection,
  orientation,
  rem,
  vh,
  vw,
} from "../../common";

type ComputedAtom = Atom & { computedStyle: Style; recompute: () => Style };

const window = Dimensions.get("window");
let dangerouslyCompileStyles: ((classNames: string) => void) | undefined;
let dimensionsListener: EmitterSubscription | undefined;

const defaultVariables = {
  [rem]: 14, // RN appears to use fontSize: 14 as a default for <Text />
  [colorSchemeKey]: Appearance.getColorScheme() ?? "light",
  [colorSchemeSystemKey]: "system",
  [i18nDirection]: I18nManager.isRTL ? "rtl" : "ltr",
  [vw]: window.width,
  [vh]: window.height,
  [orientation]: window.width > window.height ? "landscape" : "portrait",
};

const defaultClassList = {
  parent: { childClassList: "parent:children" },
};

interface ClassListRecord {
  style?: Style;
  childClassList?: string;
}

const classListMap = new Map<string, ClassListRecord>(
  Object.entries(defaultClassList)
);

const componentListeners = new Set<() => void>();

const emptyStyles = {};
export const atoms = new Map<string, ComputedAtom>();
const atomDependents = new Map<string, Set<string>>();

export const variables = new Map<string, VariableValue>(
  Object.entries(defaultVariables)
);
const variableSubscriptions = new Map<string, Set<() => void>>();
let rootVariableValues: Record<string, VariableValue> = {};
let darkRootVariableValues: Record<string, VariableValue> = {};

export function create(atomRecord: AtomRecord) {
  for (const [name, atom] of Object.entries(atomRecord)) {
    if (name === ":root") {
      if (atom.variables) {
        rootVariableValues = atom.variables[0];

        if (rootVariableValues[darkModeKey] !== "class") {
          rootVariableValues[colorSchemeKey] =
            Appearance.getColorScheme() ?? "light";
          rootVariableValues[colorSchemeSystemKey] = "system";
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

      if (getColorScheme() === "dark") {
        setVariables(darkRootVariableValues);
      }
    } else {
      setAtom(name, atom);
    }
  }

  componentListeners.forEach((l) => l());
  resetClassListMap();
}

export function getStyleSet(name: string) {
  const classList = classListMap.get(name);

  if (classList) {
    return classList.style;
  }

  if (dangerouslyCompileStyles) {
    dangerouslyCompileStyles(name);
  }

  const childClasses = [];

  for (const atom of name.split(/\s+/)) {
    let dependentSet = atomDependents.get(atom);

    const atomChildClasses = atoms.get(atom)?.childClasses;
    if (atomChildClasses) childClasses.push(...atomChildClasses);

    if (!dependentSet) {
      dependentSet = new Set();
      atomDependents.set(atom, dependentSet);
    }
    dependentSet.add(name);
  }

  if (childClasses.length > 0) {
    classListMap.set(name, {
      ...classListMap.get(name),
      childClassList: childClasses.join(" "),
    });
  }

  return updateStyleSet(name).style;
}

function updateStyleSet(classList: string) {
  const style: Style = {};

  for (const atomName of classList.split(/\s+/)) {
    Object.assign(style, getAtomStyle(atomName));
  }

  const newClassList = {
    ...classListMap.get(classList),
    style: style,
  };

  classListMap.set(classList, newClassList);

  return newClassList;
}

export function getChildClassList(classList: string) {
  return classListMap.get(classList)?.childClassList;
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
    if (!computedAtom.computedStyle && atom.subscriptions) {
      for (const topic of atom.subscriptions) {
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

      if (atRules && atRules.length >= 0) {
        atRuleConditionsMet = atRules.every(([rule, condition]) => {
          switch (rule) {
            case colorSchemeKey: {
              return variables.get(colorSchemeKey) === condition;
            }
            case "platform": {
              return condition === Platform.OS;
            }
            case "width": {
              return condition === resolve(variables.get(vw));
            }
            case "min-width": {
              const current = resolve(variables.get(vw));
              if (
                typeof current !== "number" ||
                typeof condition !== "number"
              ) {
                return false;
              }
              return current >= condition;
            }
            case "max-width": {
              const current = resolve(variables.get(vw));
              if (
                typeof current !== "number" ||
                typeof condition !== "number"
              ) {
                return false;
              }
              return current <= condition;
            }
            case "height": {
              return condition === resolve(variables.get(vh));
            }
            case "min-height": {
              const current = resolve(variables.get(vh));
              if (
                typeof current !== "number" ||
                typeof condition !== "number"
              ) {
                return false;
              }
              return current >= condition;
            }
            case "max-height": {
              const current = resolve(variables.get(vh));
              if (
                typeof current !== "number" ||
                typeof condition !== "number"
              ) {
                return false;
              }
              return current <= condition;
            }
            default: {
              return true;
            }
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

  atomDependents.get(name)?.forEach((dependent) => {
    updateStyleSet(dependent);
  });
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

export function __dangerouslyCompileStyles(
  callback: typeof dangerouslyCompileStyles
) {
  dangerouslyCompileStyles = callback;
}

export function setDimensions(dimensions: Dimensions) {
  dimensionsListener?.remove();

  const window = dimensions.get("window");

  setVariables({
    [vw]: window.width,
    [vh]: window.height,
    [orientation]: window.width > window.height ? "landscape" : "portrait",
  });

  dimensionsListener = dimensions.addEventListener("change", ({ window }) => {
    setVariables({
      [vw]: window.width,
      [vh]: window.height,
      [orientation]: window.width > window.height ? "landscape" : "portrait",
    });
  });
}

export function resetRuntime() {
  componentListeners.clear();
  variableSubscriptions.clear();
  atomDependents.clear();
  atoms.clear();
  variables.clear();
  rootVariableValues = {};
  darkRootVariableValues = {};
  dangerouslyCompileStyles = undefined;

  setVariables(defaultVariables);
  resetClassListMap();
}

function resetClassListMap() {
  classListMap.clear();
  for (const entry of Object.entries(defaultClassList)) {
    classListMap.set(...entry);
  }
}
