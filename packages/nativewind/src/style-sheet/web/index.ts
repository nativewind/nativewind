import type { NativeWindStyleSheet as NativeWindStyleSheetInterface } from "../index";
import { setVariables } from "./runtime";
import {
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
} from "./color-scheme";
import { useVariable } from "./use-variable";

const noop = () => {
  return;
};

export const NativeWindStyleSheet: NativeWindStyleSheetInterface = {
  create: noop,
  __reset: noop,
  getColorScheme,
  setColorScheme,
  toggleColorScheme,
  setVariables,
  setDimensions: noop,
  useVariable,
};
