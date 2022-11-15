import { StyleSheet } from "react-native";
import type { NativeWindStyleSheet as NativeWindStyleSheetInterface } from "../../types/stylesheet";
import { setVariables } from "./runtime";
import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";

const noop = () => {
  return;
};

if (typeof StyleSheet.create({ test: {} }).test !== "object") {
  // eslint-disable-next-line unicorn/prefer-type-error
  throw new Error("NativeWind only supports React Native Web >=0.18");
}

let webMergeStrategy: (classes: string) => string = (classes) => classes;

export const NativeWindStyleSheet: NativeWindStyleSheetInterface = {
  create: noop,
  __reset: noop,
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
  setVariables,
  setDimensions: noop,
  setWebClassNameMergeStrategy: (callback) => {
    webMergeStrategy = callback;
  },
  __dangerouslyCompileStyles: noop,
};

export function mergeClassNames(className: string) {
  return webMergeStrategy(className);
}

export { useUnsafeVariable } from "./use-unsafe-variable";
