import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector";
import { Dimensions, I18nManager } from "react-native";

import context, { Meta } from "./context";
import { setDimensions } from "./dimensions";
import { setDirection } from "./i18n";
import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";
import { create } from "./create";

export const NativeWindStyleSheet = {
  create,
  reset,
  warmCache,
  useSync,
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

function useSync(
  className: string,
  componentState: Record<string, boolean | number> = {}
) {
  const keyTokens: string[] = [];
  const conditions = new Set<string>();
  let meta: Meta = {};

  for (const atomName of className.split(/\s+/)) {
    const atom = context.atoms.get(atomName);

    if (!atom) {
      if (context.meta.has(atomName)) {
        meta = { ...meta, ...context.meta.get(atomName) };
      }
      continue;
    }

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
            default: {
              conditionsPass = Boolean(componentState[condition]);
            }
          }
        }
      }

      if (conditionsPass) {
        keyTokens.push(atomName);
        meta = { ...meta, ...context.meta.get(atomName) };
      }
    } else {
      keyTokens.push(atomName);
      meta = { ...meta, ...context.meta.get(atomName) };
    }
  }

  const key = keyTokens.join(" ");

  if (!context.styleSets[key] && key.length > 0) {
    warmCache([key]);
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
    meta,
    conditions,
  };
}

function warmCache(classesToWarm: Array<string>) {
  for (const key of classesToWarm) {
    const keyTokens = key.split(" ");

    context.setStyleSets({
      [key]: keyTokens.flatMap((token) => {
        return context.styles[token] ?? [];
      }),
    });

    context.subscribeToStyles((styles, oldStyles) => {
      const hasChanged = keyTokens.some((token) => {
        return styles[token] !== oldStyles[token];
      });

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

  if (typeof document !== "undefined") {
    for (const [key, value] of Object.entries(properties)) {
      document.documentElement.style.setProperty(key, value.toString());
    }
  }
}

NativeWindStyleSheet.reset();
