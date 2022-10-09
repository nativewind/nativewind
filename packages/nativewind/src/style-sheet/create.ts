import { Platform } from "react-native";

import { Atom, AtomRecord, Style } from "../postcss/types";
import { getColorScheme } from "./color-scheme";
import context, { Styles } from "./context";
import { resolve } from "./resolve";

export function create(options: AtomRecord) {
  // Please keep this, is useful for debugging
  // console.log(JSON.stringify(options, undefined, 2));

  if (context.preprocessed) {
    return;
  }

  const root = options[":root"];
  if (root?.variables) {
    context.updateRootVariableValues(root.variables[0]);
  }

  const dark = options["dark"];
  if (dark?.variables) {
    context.updateDarkRootVariableValues(dark.variables[0]);
  }

  if (root || dark) {
    context.setTopics(
      getColorScheme() === "light"
        ? context.rootVariableValues
        : context.darkRootVariableValues
    );
  }

  let newStyles: Styles = {};

  for (const [atomName, atom] of Object.entries(options)) {
    if (atomName === ":root" || atomName === "dark") {
      continue;
    }

    if (atom.topics) {
      atom.topicSubscription = context.subscribeToTopics(
        (values, oldValues) => {
          const topicChanged = atom.topics?.some((topic) => {
            return values[topic] !== oldValues[topic];
          });

          if (!topicChanged) {
            return;
          }

          context.setStyles(evaluate(atomName, atom));
        }
      );
    }

    // Remove any existing subscriptions
    context.atoms.get(atomName)?.topicSubscription?.();
    context.atoms.set(atomName, atom);
    newStyles = { ...newStyles, ...evaluate(atomName, atom) };
  }

  context.setStyles(newStyles);
}

function evaluate(name: string, atom: Atom): Styles | undefined {
  const atomStyles: Style[] = [];
  let newStyles: Styles = {
    [name]: atomStyles,
  };

  if (!atom.styles) return;

  for (const [index, originalStyles] of atom.styles.entries()) {
    const styles = { ...originalStyles } as Style;

    for (const [key, value] of Object.entries(styles)) {
      (styles as Record<string, unknown>)[key] = resolve(value);
    }

    const atRules = atom.atRules?.[index];

    if (!atRules || atRules.length === 0) {
      atomStyles.push(styles);
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
            return params === resolve(context.topics["--window-height"]);
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
      atomStyles.push(styles);

      // If there are children also add them.
      if (atom.childClasses) {
        for (const child of atom.childClasses) {
          const childAtom = context.atoms.get(child);
          if (childAtom) {
            evaluate(child, childAtom);
          }
        }
      }
    } else {
      // If we failed the atRulesResult, remove the child class styles
      if (atom.childClasses) {
        for (const child of atom.childClasses) {
          newStyles[child] = undefined;
        }
      }
    }
  }

  if (atom.meta) {
    context.meta.set(name, atom.meta);
  }

  return newStyles;
}
