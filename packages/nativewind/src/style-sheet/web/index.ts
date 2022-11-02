import { StyleSheet } from "react-native";
import type { NativeWindStyleSheet as NativeWindStyleSheetInterface } from "../index";
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

export const NativeWindStyleSheet: NativeWindStyleSheetInterface = {
  create: noop,
  __reset: noop,
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
  setVariables,
  setDimensions: noop,
  __dangerouslyCompileStyles: noop,
};

export { useUnsafeVariable } from "./use-unsafe-variable";
