import { createElement } from "react";
import {
  cssInterop,
  remapProps,
  createElementAndCheckCssInterop,
} from "./runtime/components/rendering";
import { unstable_styled } from "./runtime/components/styled";

import { StyleSheet } from "./runtime/web/stylesheet";
import { colorScheme, useColorScheme } from "./runtime/web/color-scheme";
import { useUnstableNativeVariable, vars } from "./runtime/web/variables";
import { rem } from "./runtime/web/rem";

export {
  createElement,
  createElementAndCheckCssInterop,
  rem,
  useUnstableNativeVariable,
  cssInterop,
  remapProps,
  unstable_styled,
  vars,
  colorScheme,
  useColorScheme,
  StyleSheet,
};
