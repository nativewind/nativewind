import { StyleSheet as RNStyleSheet } from "react-native";
import { ResetOptions, StyleSheetRegisterOptions } from "../../types";

export const StyleSheet = Object.assign(
  {},
  {
    classNameMergeStrategy(c: string) {
      return c;
    },
    register(_options: StyleSheetRegisterOptions) {
      throw new Error("Stylesheet.register is not available on web");
    },
    rem() {
      throw new Error("Stylesheet.rem is not available on web");
    },
    __reset(_options: ResetOptions = {}) {
      return;
    },
  },
  RNStyleSheet,
);
