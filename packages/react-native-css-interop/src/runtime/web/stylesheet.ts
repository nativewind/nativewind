import { StyleSheet as RNStyleSheet } from "react-native";
import { CommonStyleSheet } from "../../types";
import {
  DevHotReloadSubscription,
  INTERNAL_RESET,
  INTERNAL_FLAGS,
} from "../../shared";

export const useUnstableNativeVariables = () => ({});
export function vars(variables: Record<`--${string}`, string | number>) {
  return variables;
}

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
  dangerouslyCompileStyles() {},
  [DevHotReloadSubscription]() {
    return () => {};
  },
  register(_options) {
    throw new Error("Stylesheet.register is not available on web");
  },
  setRem(value) {
    const document = globalThis.window?.document.documentElement;
    if (document) {
      document.style.fontSize = `${value}px`;
    } else {
      throw new Error(
        "Cannot use setRem during SSR. Please either manually set it or use CSS styles.",
      );
    }
  },
  getRem(value) {
    const document = globalThis.window?.document.documentElement;
    if (document) {
      document.style.fontSize = `${value}px`;
    } else {
      throw new Error("Cannot use getRem during SSR");
    }
  },
};

export const StyleSheet = Object.assign({}, commonStyleSheet, RNStyleSheet);
