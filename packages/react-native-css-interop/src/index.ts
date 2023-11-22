import { createElement } from "react";
import { cssInterop, remapProps } from "./runtime/components";
import { unstable_styled } from "./runtime/components/styled";

import { StyleSheet } from "./runtime/web/stylesheet";
import { colorScheme, useColorScheme } from "./runtime/web/color-scheme";
import { useUnstableNativeVariable, vars } from "./runtime/web/variables";
import { rem } from "./runtime/web/rem";

export {
  createElement,
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
