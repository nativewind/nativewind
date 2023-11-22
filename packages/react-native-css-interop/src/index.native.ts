import { createElement } from "react";
import { cssInterop, remapProps } from "./runtime/components";
import { unstable_styled } from "./runtime/components/styled";

import { StyleSheet } from "./runtime/native/stylesheet";
import {
  colorScheme,
  useColorScheme,
  useUnstableNativeVariable,
  vars,
  rem,
} from "./runtime/native/globals";

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
