import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";
import { createContext, useContext, useReducer } from "react";

import {
  StyleSheetRegisterOptions,
  ExtractedStyle,
  StyleProp,
  StyleMeta,
  CommonStyleSheet,
} from "../../types";
import {
  OpaqueStyleToken,
  animationMap,
  colorScheme,
  globalStyles,
  opaqueStyles,
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
  INTERNAL_VERIFICATION_FLAGS as INTERNAL_VERIFICATION_FLAGS,
  INTERNAL_RESET,
} from "../../shared";
import { createSignal, useComputation } from "./signals";

const subscriptions = new Set<() => void>();
export const rootVariables = createSignal<Record<string, unknown>>({});
export const defaultVariables = createSignal<Record<string, unknown>>({});
export const VariableContext = createContext<Record<string, unknown> | null>(
  null,
);

export const useRerender = () => useReducer(rerenderReducer, 0)[1];
const rerenderReducer = (accumulator: number) => accumulator + 1;

export const useUnstableNativeVariables = () => {
  return useNativeVariables(useRerender());
};

export const useNativeVariables = (rerender: () => void) => {
  const variables = useContext(VariableContext);
  return useComputation(
    () => {
      // $variables will be null if this is a top-level component
      if (variables === null) {
        return rootVariables.get();
      } else {
        return {
          ...variables,
          ...defaultVariables.get(),
        };
      }
    },
    [variables],
    rerender,
  );
};

let variables = {
  rootVariables: {} as Record<string, unknown>,
  rootDarkVariables: {} as Record<string, unknown>,
  defaultVariables: {} as Record<string, unknown>,
  defaultDarkVariables: {} as Record<string, unknown>,
};

const commonStyleSheet: CommonStyleSheet = {
  [DarkMode]: { type: "media" },
  [INTERNAL_VERIFICATION_FLAGS]: {},
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
    rootVariables.set({});
    defaultVariables.set({});
    variables = {
      rootVariables: {},
      rootDarkVariables: {},
      defaultVariables: {},
      defaultDarkVariables: {},
    };
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
    this[INTERNAL_VERIFICATION_FLAGS]["$$receivedData"] = true;
    if (options.verify) {
      Object.assign(this[INTERNAL_VERIFICATION_FLAGS], options.verify);
    }

    if (options.keyframes) {
      for (const [name, keyframes] of Object.entries(options.keyframes)) {
        animationMap.set(name, keyframes);
      }
    }

    // console.log(JSON.stringify(options.declarations, null, 2));

    if (options.declarations) {
      for (const [name, styles] of Object.entries(options.declarations)) {
        const taggedStyles = tagStyles(name, styles);
        if (taggedStyles) {
          globalStyles.set(name, taggedStyles);
        }
      }
    }

    const currentColor = Appearance.getColorScheme() ?? "light";
    let shouldResetRootVariables = false;
    let shouldResetDefaultVariables = false;

    if (options.rootVariables) {
      Object.assign(variables.rootVariables, options.rootVariables);
      shouldResetRootVariables = true;
    }
    if (options.rootDarkVariables) {
      Object.assign(variables.rootDarkVariables, options.rootDarkVariables);
      shouldResetRootVariables ||= currentColor === "dark";
    }

    if (options.defaultVariables) {
      Object.assign(variables.defaultVariables, options.defaultVariables);
      shouldResetRootVariables = true;
      shouldResetDefaultVariables = true;
    }

    if (options.defaultDarkVariables) {
      shouldResetRootVariables ||= currentColor === "dark";
      shouldResetDefaultVariables ||= currentColor === "dark";
      Object.assign(
        variables.defaultDarkVariables,
        options.defaultDarkVariables,
      );
    }

    if (shouldResetRootVariables) {
      resetRootVariables(currentColor);
    }

    if (shouldResetDefaultVariables) {
      resetDefaultVariables(currentColor);
    }

    for (const subscription of subscriptions) {
      subscription();
    }
  },
  setColorScheme(value) {
    colorScheme.set(value);
    resetRootVariables(colorScheme.get());
    resetDefaultVariables(colorScheme.get());
  },
  setDarkMode() {},
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

function resetRootVariables(currentColor: "light" | "dark") {
  if (currentColor === "light") {
    rootVariables.set({
      ...variables.rootVariables,
      ...variables.defaultVariables,
    });
  } else {
    rootVariables.set({
      ...variables.rootVariables,
      ...variables.rootDarkVariables,
      ...variables.defaultVariables,
      ...variables.defaultDarkVariables,
    });
  }
}

function resetDefaultVariables(currentColor: "light" | "dark") {
  if (currentColor === "light") {
    defaultVariables.set(variables.defaultVariables);
  } else {
    defaultVariables.set({
      ...variables.defaultVariables,
      ...variables.defaultDarkVariables,
    });
  }
}

export function vars(variables: Record<string, string | number>) {
  // Create an empty style prop with meta
  const styleProp = {};

  const $variables: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(variables)) {
    if (key.startsWith("--")) {
      $variables[key] = value;
    } else {
      $variables[`--${key}`] = value;
    }
  }
  styleMetaMap.set(styleProp, { variables: $variables });

  // Assign it an OpaqueStyleToken
  const opaqueStyle = new OpaqueStyleToken();
  opaqueStyles.set(opaqueStyle, styleProp);

  return opaqueStyle as StyleProp;
}
