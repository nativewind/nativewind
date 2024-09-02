import { getStyle, injectData } from "./styles";
import { CssInteropStyleSheet } from "../../types";
import { flags } from "./globals";
// import { ExtractedAnimation, StyleRuleSet } from "../../types";
// import { Observable } from "../observable";

export const StyleSheet: CssInteropStyleSheet = {
  getGlobalStyle(name: string) {
    return getStyle(name);
  },
  register() {
    throw new Error("Not yet implemented");
  },
  registerCompiled(options) {
    return injectData(options);
  },
  getFlag(name) {
    return flags.get(name)?.toString();
  },
};
