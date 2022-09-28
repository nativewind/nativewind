import {
  OpaqueColorValue,
  PixelRatio,
  Platform,
  PlatformColor,
  StyleSheet,
} from "react-native";

import { Atom, AtomRecord, Style, VariableValue } from "../postcss/types";
import { getColorScheme } from "./color-scheme";
import context from "./context";

export function create(options: AtomRecord) {
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

  let newStyles: Record<string, Style[] | undefined> = {};

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

function evaluate(name: string, atom: Atom) {
  const atomStyles: Style[] = [];
  let newStyles: Record<string, Style[] | undefined> = {
    [name]: atomStyles,
  };

  if (!atom.styles) return;

  for (const [index, originalStyles] of atom.styles.entries()) {
    const styles = { ...originalStyles } as Style;

    for (const [key, value] of Object.entries(styles)) {
      if (typeof value === "object" && "function" in value) {
        (styles as Record<string, unknown>)[key] = resolveVariableValue(value);
      }
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
            return (
              params === resolveVariableValue(context.topics["device-width"])
            );
          case "min-width": {
            const value = resolveVariableValue(context.topics["device-width"]);
            if (typeof value !== "number") return false;
            return (params ?? 0) >= value;
          }
          case "max-width": {
            const value = resolveVariableValue(context.topics["device-width"]);
            if (typeof value !== "number") return false;
            return (params ?? 0) <= value;
          }
          case "height":
            return (
              params === resolveVariableValue(context.topics["device-height"])
            );
          case "min-height": {
            const value = resolveVariableValue(context.topics["device-height"]);
            if (typeof value !== "number") return false;
            return (params ?? 0) >= value;
          }
          case "max-height": {
            const value = resolveVariableValue(context.topics["device-height"]);
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
            newStyles = { ...newStyles, ...evaluate(child, childAtom) };
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

  return newStyles;
}

function resolveVariableValue(
  style: VariableValue
): string | number | OpaqueColorValue | undefined {
  if (typeof style !== "object" || !("function" in style)) {
    return style;
  }

  const resolvedValues = style.values.map((value) =>
    resolveVariableValue(value)
  );

  switch (style.function) {
    case "inbuilt": {
      const [name, ...values] = resolvedValues;
      return [name, "(", values.join(", "), ")"].join("");
    }
    case "vw": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return value * (context.topics["device-width"] as number);
    }
    case "vh": {
      const [value] = resolvedValues;
      if (typeof value !== "number") return;
      return value * (context.topics["device-height"] as number);
    }
    case "var": {
      const [variable, defaultValue] = resolvedValues;
      if (typeof variable !== "string") return;
      const value = context.topics[variable];
      if (!value) return defaultValue;
      if (typeof value === "object" && "function" in value) return defaultValue;
      return value;
    }
    case "platformSelect": {
      const specifics = resolveSpecifics(resolvedValues);
      return Platform.select(specifics);
    }
    case "platformColor": {
      return PlatformColor(
        ...resolvedValues.filter(
          (value): value is string => typeof value === "string"
        )
      );
    }
    case "hairlineWidth":
      return StyleSheet.hairlineWidth;
    case "pixelRatio": {
      if (resolvedValues.length > 0) {
        const specifics = resolveSpecifics(resolvedValues);
        return specifics[PixelRatio.get()];
      } else {
        return PixelRatio.get();
      }
    }
    case "fontScale": {
      if (resolvedValues.length > 0) {
        const specifics = resolveSpecifics(resolvedValues);
        return specifics[PixelRatio.getFontScale()];
      } else {
        return PixelRatio.getFontScale();
      }
    }
    case "getPixelSizeForLayoutSize": {
      const value = resolvedValues[0];
      if (typeof value !== "number") return;
      return PixelRatio.getPixelSizeForLayoutSize(value);
    }
    case "roundToNearestPixel": {
      const value = resolvedValues[0];
      if (typeof value !== "number") return;
      return PixelRatio.roundToNearestPixel(value);
    }
  }
}

function resolveSpecifics(
  values: (string | number | OpaqueColorValue | undefined)[]
) {
  return Object.fromEntries(
    values
      .filter((value): value is string => typeof value === "string")
      .map((value) => {
        const [platform, other] = value.split("_");
        return [platform, resolveVariableValue(other)];
      })
  );
}
