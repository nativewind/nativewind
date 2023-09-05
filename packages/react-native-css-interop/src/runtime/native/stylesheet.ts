import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";

import {
  StyleSheetRegisterOptions,
  ExtractedStyle,
  StyleProp,
  StyleMeta,
  CommonStyleSheet,
  ExtractionWarning,
} from "../../types";
import {
  OpaqueStyleToken,
  animationMap,
  globalStyles,
  opaqueStyles,
  styleMetaMap,
  styleSpecificity,
  vh,
  vw,
} from "./misc";
import { INTERNAL_FLAGS as INTERNAL_FLAGS, INTERNAL_RESET } from "../../shared";
import { colorScheme } from "./color-scheme";
import {
  getVariables,
  resetDefaultVariables,
  resetRootVariables,
  resetVariables,
} from "./variables";
import { rem } from "./rem";
import { createSignal } from "../signals";

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export const devForceReload = createSignal({});

const commonStyleSheet: CommonStyleSheet = {
  [INTERNAL_FLAGS]: {},
  [INTERNAL_RESET]({ dimensions = Dimensions, appearance = Appearance } = {}) {
    globalStyles.clear();
    animationMap.clear();
    warnings.clear();
    warned.clear();
    rem[INTERNAL_RESET]();
    vw[INTERNAL_RESET](dimensions);
    vh[INTERNAL_RESET](dimensions);
    colorScheme[INTERNAL_RESET](appearance);
    resetVariables();
  },
  getFlag(name) {
    return this[INTERNAL_FLAGS][name];
  },
  classNameMergeStrategy(c) {
    return c;
  },
  unstable_hook_onClassName() {},
  register(options: StyleSheetRegisterOptions) {
    this[INTERNAL_FLAGS]["$$receivedData"] = "true";
    if (options.flags) {
      Object.assign(this[INTERNAL_FLAGS], options.flags);
    }

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

    const currentColor = colorScheme.get();
    let shouldResetRootVariables = false;
    let shouldResetDefaultVariables = false;

    const variables = getVariables();

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

    devForceReload.set({});
  },
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
    if (styles.importantStyles) {
      meta.importantStyles = styles.importantStyles;
      hasMeta = true;
    }

    if (process.env.NODE_ENV !== "production" && styles.warnings) {
      warnings.set(name, styles.warnings);
    }

    if (hasMeta && styles.style) {
      styleMetaMap.set(styles.style, meta);
    }

    styleSpecificity.set(styles.style, styles.specificity);

    return styles.style;
  }
}

export function getGlobalStyle(style?: string | object) {
  if (!style) return;
  if (typeof style === "string") {
    StyleSheet.unstable_hook_onClassName(style);

    if (warnings.has(style) && !warned.has(style)) {
      warned.add(style);
      if (process.env.NODE_ENV === "development") {
        console.log(warnings.get(style));
      }
    }

    return globalStyles.get(style);
  } else {
    return opaqueStyles.get(style) ?? style;
  }
}

export function getOpaqueStyle(name?: string | object) {
  const style = getGlobalStyle(name);

  if (!style) return;

  const opaqueStyle = Object.freeze(new OpaqueStyleToken());
  opaqueStyles.set(opaqueStyle, style);
  styleSpecificity.set(opaqueStyle, getSpecificity(style));

  return opaqueStyle;
}

export function getSpecificity(style?: object) {
  if (style) {
    return styleSpecificity.get(style) ?? { inline: 1 };
  } else {
    return { inline: 1 };
  }
}
