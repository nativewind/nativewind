import { StyleSheet as RNStyleSheet } from "react-native";
import { CommonStyleSheet } from "../../types";
import { INTERNAL_RESET, INTERNAL_FLAGS } from "../../shared";

const documentStyle: CSSStyleDeclaration | undefined =
  globalThis.window?.getComputedStyle(
    globalThis.window?.document.documentElement,
  );

const commonStyleSheet: CommonStyleSheet = {
  [INTERNAL_FLAGS]: {},
  getFlag(name) {
    return documentStyle?.getPropertyValue(`--css-interop-${name}`);
  },
  [INTERNAL_RESET](_options) {
    return;
  },
  classNameMergeStrategy(c) {
    return c;
  },
  unstable_hook_onClassName() {},
  register(_options) {
    throw new Error("Stylesheet.register is not available on web");
  },
};

export const StyleSheet = Object.assign({}, commonStyleSheet, RNStyleSheet);
