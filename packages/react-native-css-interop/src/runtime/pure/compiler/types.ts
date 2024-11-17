import { RuntimeValueDescriptor } from "test";

import { FeatureFlagStatus } from "../../../css-to-rn/feature-flags";
import { RawAnimation } from "../reanimated";
import { StyleRule, StyleRuleSet } from "../types";

export type CompilerOptions = {
  inlineRem?: number | false;
  grouping?: (string | RegExp)[];
  ignorePropertyWarningRegex?: (string | RegExp)[];
  selectorPrefix?: string;
  stylesheetOrder?: number;
  features?: FeatureFlagStatus;
};

export type DarkMode = ["media"] | ["class", string] | ["attribute", string];

export type VariableCollection = Record<string, RuntimeValueDescriptor[]>;

export interface CompilerCollection extends CompilerOptions {
  rules: Map<string, StyleRule[]>;
  animations: Map<string, RawAnimation>;
  grouping: RegExp[];
  darkMode?: DarkMode;
  rootVariables: VariableCollection;
  universalVariables: VariableCollection;
  flags: Record<string, unknown>;
  selectorPrefix?: string;
  appearanceOrder: number;
  rem?: number | boolean;
  varUsageCount: Map<string, number>;
}

export interface InjectStylesOptions {
  f?: FeatureFlagStatus;
  /** rem */
  r?: number;
  /** StyleRuleSets */
  s?: [string, StyleRuleSet][];
  a?: [string, RawAnimation][];
  va?: [string, RuntimeValueDescriptor[]][];
  vu?: [string, RuntimeValueDescriptor[]][];
}
