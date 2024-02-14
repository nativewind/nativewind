import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";

import { CssInteropStyleSheet, ExtractedAnimation } from "../../types";
import { INTERNAL_FLAGS as INTERNAL_FLAGS, INTERNAL_RESET } from "../../shared";
import { globalStyles, upsertGlobalStyle } from "./style-store";
import {
  colorScheme,
  cssVariableObservable,
  externalCallbackRef,
  rem,
  rootVariables,
  universalVariables,
  vh,
  vw,
  warned,
  warnings,
} from "./globals";

export const animationMap = new Map<string, ExtractedAnimation>();
export { globalStyles };

const commonStyleSheet: CssInteropStyleSheet = {
  [INTERNAL_FLAGS]: {},
  [INTERNAL_RESET]({ dimensions = Dimensions, appearance = Appearance } = {}) {
    globalStyles.clear();
    animationMap.clear();
    warnings.clear();
    warned.clear();
    rem.set(14);
    vw[INTERNAL_RESET](dimensions);
    vh[INTERNAL_RESET](dimensions);
    colorScheme[INTERNAL_RESET](appearance);
  },
  getFlag(name) {
    return this[INTERNAL_FLAGS][name];
  },
  unstable_hook_onClassName(callback) {
    externalCallbackRef.current = callback;
  },
  register() {
    throw new Error("Stylesheet.register is not yet implemented");
  },
  getGlobalStyle(name: string) {
    return globalStyles.get(name);
  },
  registerCompiled(options) {
    this[INTERNAL_FLAGS]["$$receivedData"] = "true";

    if (options.flags) {
      Object.assign(this[INTERNAL_FLAGS], options.flags);
    }

    options.rules?.forEach((rule) => upsertGlobalStyle(rule[0], rule[1]));

    options.keyframes?.forEach((keyframe) => {
      animationMap.set(keyframe[0], keyframe[1]);
    });

    if (options.rootVariables) {
      for (const [name, value] of Object.entries(options.rootVariables)) {
        let variable = rootVariables[name];
        if (!variable) {
          variable = cssVariableObservable(value);
          rootVariables[name] = variable;
        }
        variable.set(value);
      }
    }

    if (options.universalVariables) {
      for (const [name, value] of Object.entries(options.universalVariables)) {
        let variable = universalVariables[name];
        if (!variable) {
          variable = cssVariableObservable(value);
          universalVariables[name] = variable;
        }
        variable.set(value);
      }
    }

    if (options.rem) rem.set(options.rem);
  },
};

export const StyleSheet = Object.assign({}, commonStyleSheet, RNStyleSheet);
