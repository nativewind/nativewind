import { Dimensions, I18nManager } from "react-native";

import { setDimensions } from "./dimensions";
import { create, resetRuntime, setVariables } from "./runtime";
import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";

export const NativeWindStyleSheet = {
  create,
  reset,
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
  setVariables,
  setDimensions,
  // isPreprocessed: () => context.preprocessed,
  // setDangerouslyCompileStyles: context.setDangerouslyCompileStyles,
};

function reset() {
  resetRuntime();
  setDimensions(Dimensions);
  setVariables({
    "--i18n-direction": I18nManager.isRTL ? "rtl" : "ltr",
  });

  // context.preprocessed = Platform.select({
  //   default: false,
  //   web: typeof StyleSheet.create({ test: {} }).test !== "number",
  // });
  // context.dangerouslyCompileStyles = undefined;
}
reset();
