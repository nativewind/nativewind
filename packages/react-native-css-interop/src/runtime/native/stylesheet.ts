import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";
import { createContext, useContext, useMemo } from "react";

import {
  StyleSheetRegisterOptions,
  ExtractedStyle,
  StyleProp,
  StyleMeta,
  CommonStyleSheet,
} from "../../types";
import {
  animationMap,
  colorScheme,
  globalStyles,
  rem,
  styleMetaMap,
  vh,
  vw,
  warned,
  warnings,
} from "./globals";
import {
  DarkMode,
  DevHotReloadSubscription,
  INTERNAL_RESET,
} from "../../shared";

const subscriptions = new Set<() => void>();

export const VariableContext = createContext<Record<string, unknown> | null>(
  null,
);

const commonStyleSheet: CommonStyleSheet = {
  [DarkMode]: { type: "media" },
  [INTERNAL_RESET]({ dimensions = Dimensions, appearance = Appearance } = {}) {
    globalStyles.clear();
    animationMap.clear();
    warnings.clear();
    warned.clear();
    subscriptions.clear();
    rem[INTERNAL_RESET]();
    vw[INTERNAL_RESET](dimensions);
    vh[INTERNAL_RESET](dimensions);
    colorScheme[INTERNAL_RESET](appearance);
    rootVariables = {};
    rootDarkVariables = {};
    defaultVariables = {};
    defaultDarkVariables = {};
  },
  classNameMergeStrategy(c) {
    return c;
  },
  [DevHotReloadSubscription](subscription) {
    subscriptions.add(subscription);
    return () => {
      subscriptions.delete(subscription);
    };
  },
  register(options: StyleSheetRegisterOptions) {
    if (options.keyframes) {
      for (const [name, keyframes] of Object.entries(options.keyframes)) {
        animationMap.set(name, keyframes);
      }
    }

    if (options.declarations) {
      for (const [name, styles] of Object.entries(options.declarations)) {
        const taggedStyles = tagStyles(name, styles);
        if (taggedStyles) {
          globalStyles.set(name, taggedStyles);
        }
      }
    }

    if (options.defaultVariables) defaultVariables = options.defaultVariables;
    if (options.defaultDarkVariables) {
      defaultDarkVariables = {
        ...options.defaultVariables,
        ...options.defaultDarkVariables,
      };
    }
    if (options.rootVariables) {
      rootVariables = {
        ...options.rootVariables,
        ...defaultVariables,
      };
    }
    if (options.rootDarkVariables) {
      rootDarkVariables = {
        ...options?.rootVariables,
        ...options.rootDarkVariables,
        ...defaultDarkVariables,
      };
    }

    if (options.colorSchemeClass) {
    }

    for (const subscription of subscriptions) {
      subscription();
    }
  },
  setDarkMode() {},
  setColorScheme: colorScheme.set,
  setRem: rem.set,
  getRem: rem.get,
};

export const StyleSheet = Object.assign({}, commonStyleSheet, RNStyleSheet);

function tagStyles(
  name: string,
  styles: ExtractedStyle | ExtractedStyle[],
): StyleProp {
  if (Array.isArray(styles)) {
    let didTag = false;
    const taggedStyles = styles.map((s) => {
      const taggedStyle = tagStyles(name, s);
      didTag ||= Boolean(s.style && styleMetaMap.has(s.style));
      return taggedStyle;
    });

    if (didTag) {
      styleMetaMap.set(taggedStyles, {});
    }

    return taggedStyles;
  } else {
    let hasMeta = false;
    const meta: StyleMeta = {};

    if (styles.isDynamic) {
      hasMeta = true;
    }

    if (styles.variables) {
      meta.variables = styles.variables;
      hasMeta = true;
    }

    if (Array.isArray(styles.media) && styles.media.length > 0) {
      meta.media = styles.media;
      hasMeta = true;
    }

    if (styles.pseudoClasses) {
      meta.pseudoClasses = styles.pseudoClasses;
      hasMeta = true;
    }

    if (styles.animations) {
      meta.animations = styles.animations;
      hasMeta = true;

      const requiresLayout = styles.animations.name?.some((nameObj) => {
        const name = nameObj.type === "none" ? "none" : nameObj.value;
        return animationMap.get(name)?.requiresLayout;
      });

      if (requiresLayout) {
        meta.requiresLayout = true;
      }
    }

    if (styles.container) {
      meta.container = {
        names: styles.container.names,
        type: styles.container.type ?? "normal",
      };
      hasMeta = true;
    }

    if (styles.containerQuery) {
      meta.containerQuery = styles.containerQuery;
      hasMeta = true;
    }

    if (styles.transition) {
      meta.transition = styles.transition;
      hasMeta = true;
    }
    if (styles.requiresLayout) {
      meta.requiresLayout = styles.requiresLayout;
      hasMeta = true;
    }

    if (process.env.NODE_ENV !== "production" && styles.warnings) {
      warnings.set(name, styles.warnings);
    }

    if (hasMeta && styles.style) {
      styleMetaMap.set(styles.style, meta);
    }

    return styles.style;
  }
}

let rootVariables: Record<string, unknown> = {};
let rootDarkVariables: Record<string, unknown> = {};
let defaultVariables: Record<string, unknown> = {};
let defaultDarkVariables: Record<string, unknown> = {};

export function useVariables() {
  const $variables = useContext(VariableContext);
  const colorScheme = Appearance.getColorScheme();

  return useMemo(() => {
    // $variables will be null if this is a top-level component
    if ($variables === null) {
      return colorScheme === "light" ? rootVariables : rootDarkVariables;
    } else {
      return colorScheme === "light"
        ? {
            ...$variables,
            ...defaultVariables,
          }
        : {
            ...$variables,
            ...defaultDarkVariables,
          };
    }
  }, [$variables, colorScheme]);
}
