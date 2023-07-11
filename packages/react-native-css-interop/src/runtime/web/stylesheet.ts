import { StyleSheet as RNStyleSheet } from "react-native";

export const StyleSheet = Object.assign(
  {},
  {
    classNameMergeStrategy(c: string) {
      return c;
    },
    register() {
      throw new Error("Stylesheet.register is not available on web");
    },
    rem() {
      throw new Error("Stylesheet.rem is not available on web");
    },
  },
  RNStyleSheet,
);
