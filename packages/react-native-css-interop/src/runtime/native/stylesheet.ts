import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";

import {
  StyleSheetRegisterOptions,
  CommonStyleSheet,
  Specificity,
} from "../../types";
import { vh, vw } from "./misc";
import { INTERNAL_FLAGS as INTERNAL_FLAGS, INTERNAL_RESET } from "../../shared";
import { colorScheme } from "./color-scheme";
import { createSignal } from "../signals";
import { createColorSchemeSignal, globalVariables } from "./inheritance";
import { animationMap, globalStyles } from "../globals";
import { styleSignals, upsertStyleSignal, warned, warnings } from "./style";

export const fastReloadSignal = createSignal(0, "fast-reload");

const commonStyleSheet: CommonStyleSheet = {
  [INTERNAL_FLAGS]: {},
  [INTERNAL_RESET]({ dimensions = Dimensions, appearance = Appearance } = {}) {
    globalStyles.clear();
    animationMap.clear();
    warnings.clear();
    warned.clear();
    globalVariables.rem.set(14);
    styleSignals.clear();
    vw[INTERNAL_RESET](dimensions);
    vh[INTERNAL_RESET](dimensions);
    colorScheme[INTERNAL_RESET](appearance);
  },
  getFlag(name) {
    return this[INTERNAL_FLAGS][name];
  },
  classNameMergeStrategy(c) {
    return c;
  },
  unstable_hook_onClassName() {},
  register(options: StyleSheetRegisterOptions) {
    console.log(JSON.stringify(options, null, 2));
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
      for (let [name, styles] of Object.entries(options.declarations)) {
        if (!Array.isArray(styles)) styles = [styles];
        upsertStyleSignal(name, styles);
      }
    }

    if (options.rootVariables) {
      for (const [name, value] of Object.entries(options.rootVariables)) {
        let signal = globalVariables.root.get(name);
        if (!signal) {
          signal = createColorSchemeSignal(`root:${name}`);
          globalVariables.root.set(name, signal);
        }
        signal.set(value);
      }
    }

    if (options.universalVariables) {
      for (const [name, value] of Object.entries(options.universalVariables)) {
        let signal = globalVariables.universal.get(name);
        if (!signal) {
          signal = createColorSchemeSignal(`root:${name}`);
          globalVariables.universal.set(name, signal);
        }
        signal.set(value);
      }
    }

    if (options.rem) {
      globalVariables.rem.set(options.rem);
    }

    fastReloadSignal.set((fastReloadSignal.get() ?? 0) + 1);
  },
};

export const StyleSheet = Object.assign({}, commonStyleSheet, RNStyleSheet);

// function tagStyles(
//   name: string,
//   styles: ExtractedStyle | ExtractedStyle[],
// ): StyleProp {
//   if (Array.isArray(styles)) {
//     let didTag = false;
//     const taggedStyles = styles.map((s) => {
//       const taggedStyle = tagStyles(name, s);
//       didTag ||= Boolean(s.style && styleMetaMap.has(s.style));
//       return taggedStyle;
//     });

//     if (didTag) {
//       styleMetaMap.set(taggedStyles, {});
//     }

//     return taggedStyles;
//   } else {
//     let hasMeta = false;
//     const meta: StyleMeta = {};

//     if (styles.isDynamic) {
//       hasMeta = true;
//     }

//     if (styles.variables) {
//       meta.variables = styles.variables;
//       hasMeta = true;
//     }

//     if (Array.isArray(styles.media) && styles.media.length > 0) {
//       meta.media = styles.media;
//       hasMeta = true;
//     }

//     if (styles.pseudoClasses) {
//       meta.pseudoClasses = styles.pseudoClasses;
//       hasMeta = true;
//     }

//     if (styles.animations) {
//       meta.animations = styles.animations;
//       hasMeta = true;

//       const names = styles.animations.name;
//       if (names) {
//         for (const name of names) {
//           if (name.type === "none") continue;
//           const animationMeta = animationMap.get(name.value);
//           if (!animationMeta) continue;
//           meta.requiresLayoutWidth ??= animationMeta?.requiresLayoutWidth;
//           meta.requiresLayoutHeight ??= animationMeta?.requiresLayoutHeight;
//         }
//       }
//     }

//     if (styles.container) {
//       meta.container = {
//         names: styles.container.names,
//         type: styles.container.type ?? "normal",
//       };
//       hasMeta = true;
//     }

//     if (styles.containerQuery) {
//       meta.containerQuery = styles.containerQuery;
//       hasMeta = true;
//     }

//     if (styles.transition) {
//       meta.transition = styles.transition;
//       hasMeta = true;
//     }
//     if (styles.requiresLayoutWidth || styles.requiresLayoutHeight) {
//       meta.requiresLayoutWidth ??= styles.requiresLayoutWidth;
//       meta.requiresLayoutHeight ??= styles.requiresLayoutHeight;
//       hasMeta = true;
//     }

//     if (styles.importantStyles) {
//       meta.importantStyles = styles.importantStyles;
//       hasMeta = true;
//     }

//     if (styles.nativeProps) {
//       meta.nativeProps = styles.nativeProps;
//       hasMeta = true;
//     }

//     if (process.env.NODE_ENV !== "production" && styles.warnings) {
//       warnings.set(name, styles.warnings);
//     }

//     if (hasMeta && styles.style) {
//       styleMetaMap.set(styles.style, meta);
//     }

//     styleSpecificity.set(styles.style, styles.specificity);

//     return styles.style;
//   }
// }

export const inlineSpecificity: Specificity = {
  inline: 1,
  A: 0,
  B: 0,
  C: 0,
  I: 0,
  S: 1,
  O: Infinity,
};
