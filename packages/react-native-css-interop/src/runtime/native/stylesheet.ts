import {
  Dimensions,
  StyleSheet as RNStyleSheet,
  Appearance,
} from "react-native";

import { StyleSheetRegisterOptions, CommonStyleSheet } from "../../types";
import { vh, vw } from "./misc";
import { INTERNAL_FLAGS as INTERNAL_FLAGS, INTERNAL_RESET } from "../../shared";
import { colorScheme } from "./color-scheme";
import { createSignal } from "../signals";
import { createColorSchemeSignal, globalVariables } from "./inheritance";
import {
  animationMap,
  styleSignals,
  upsertStyleSignal,
  warned,
  warnings,
} from "./style";

export const fastReloadSignal = createSignal(0, "fast-reload");

const commonStyleSheet: CommonStyleSheet = {
  [INTERNAL_FLAGS]: {},
  [INTERNAL_RESET]({ dimensions = Dimensions, appearance = Appearance } = {}) {
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
  unstable_hook_onClassName() {},
  register(options: StyleSheetRegisterOptions) {
    // console.log(JSON.stringify(options, null, 2));
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
