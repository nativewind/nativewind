import type { NativeWindStyleSheet as NativeWindStyleSheetInterface } from "../../types/stylesheet";

import {
  create,
  resetRuntime,
  setVariables,
  setDimensions,
  __dangerouslyCompileStyles,
} from "./runtime";

import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";

export const NativeWindStyleSheet: NativeWindStyleSheetInterface = {
  create,
  __reset: resetRuntime,
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
  setVariables,
  setDimensions,
  __dangerouslyCompileStyles,
  getSSRStyles: () => ({}),
  setWebClassNameMergeStrategy: () => {
    return;
  },
};

export { useUnsafeVariable } from "./use-unsafe-variable";
