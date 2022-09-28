import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { Dimensions, I18nManager } from "react-native";

import context from "./context";
import { setDimensions } from "./dimensions";
import { setDirection } from "./i18n";
import {
  getColorScheme,
  resetColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";
import { create } from "./create";

export const NativeWindStyleSheet = {
  create,
  reset,
  warmCache,
  useSync,
  useVariable,
  getColorScheme,
  setColorScheme,
  setDirection,
  toggleColorScheme,
  setVariables,
  setDimensions,
  isPreprocessed: () => context.preprocessed,
  setOutput: context.setOutput,
  setDangerouslyCompileStyles: context.setDangerouslyCompileStyles,
};

function reset() {
  context.reset();
  resetColorScheme();
  setDimensions(Dimensions);
  setDirection(I18nManager.isRTL ? "rtl" : "ltr");
}

function useVariable(variable: string) {
  return useSyncExternalStoreWithSelector(
    context.subscribeToTopics,
    () => context.topics,
    () => context.topics,
    (topics) => topics[variable]
  );
}

function useSync(
  className: string,
  componentState: Record<string, boolean | number> = {}
) {
  const keyTokens: string[] = [];
  const conditions = new Set<string>();

  for (const atomName of className.split(/\s+/)) {
    const atom = context.atoms.get(atomName);

    if (!atom) continue;

    if (atom.conditions) {
      let conditionsPass = true;
      for (const condition of atom.conditions) {
        conditions.add(condition);

        if (conditionsPass) {
          switch (condition) {
            case "not-first-child":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] > 0;
              break;
            case "odd":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 1;
              break;
            case "even":
              conditionsPass =
                typeof componentState["nthChild"] === "number" &&
                componentState["nthChild"] % 2 === 0;
              break;
            default:
              conditionsPass = !!componentState[condition];
          }
        }
      }

      if (conditionsPass) {
        keyTokens.push(atomName);
      }
    } else {
      keyTokens.push(atomName);
    }
  }

  const key = keyTokens.join(" ");

  if (!context.styleSets[key] && key.length > 0) {
    warmCache([keyTokens]);
  }

  const currentStyles = useSyncExternalStoreWithSelector(
    context.subscribeToStyleSets,
    () => context.styleSets,
    () => context.styleSets,
    (styles) => styles[key]
  );

  return {
    styles: currentStyles,
    childClasses: context.childClasses.get(key),
    meta: context.styleMeta.get(key),
    conditions,
  };
}

function warmCache(tokenSets: Array<string[]>) {
  for (const keyTokens of tokenSets) {
    const key = keyTokens.join(" ");

    context.setStyleSets({
      [key]: keyTokens.flatMap((token) => {
        return context.styles[token] ?? [];
      }),
    });

    context.subscribeToStyles((styles, oldStyles) => {
      const hasChanged = keyTokens.some(
        (token) => styles[token] !== oldStyles[token]
      );

      if (hasChanged) {
        context.setStyleSets({
          [key]: keyTokens.flatMap((token) => styles[token] ?? []),
        });
      }
    });

    const children = keyTokens.flatMap((token) => {
      const childClasses = context.atoms.get(token)?.childClasses;
      return childClasses ?? [];
    });

    if (children.length > 0) {
      context.childClasses.set(key, children.join(" "));
    }
  }
}

function setVariables(properties: Record<`--${string}`, string | number>) {
  context.setTopics(properties);

  if (typeof window !== "undefined") {
    for (const [key, value] of Object.entries(properties)) {
      document.documentElement.style.setProperty(key, value.toString());
    }
  }
}

NativeWindStyleSheet.reset();
