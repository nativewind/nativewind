import type { Platform } from "react-native";
import { AtRuleTuple, Style } from "../types/common";

const commonReplacements = `^\\.|\\\\`;

export function getSelectorMask(selector: string): number {
  let mask = 0;
  let bitLevel = 1;

  for (const test of [
    "hover",
    "active",
    "focus",
    "group-hover",
    "group-active",
    "group-focus",
    "group-scoped-hover",
    "group-scoped-active",
    "group-scoped-focus",
    "parent-hover",
    "parent-active",
    "parent-focus",
    "android",
    "ios",
    "web",
    "windows",
    "macos",
    "dark",
    "rtl",
  ]) {
    if (new RegExp(`\\w+(::${test})(:|\\b)`).test(selector)) {
      mask |= bitLevel;
    }

    bitLevel *= 2;
  }

  return mask;
}

export function getSelectorTopics(
  selector: string,
  _declarations: Style,
  atRules: AtRuleTuple[] | undefined
) {
  const topics: Set<string> = new Set();

  if (hasDarkPseudoClass(selector)) topics.add("colorScheme");

  if (atRules) {
    for (const [atRule, params] of atRules) {
      if (atRule === "media" && params) {
        if (params.includes("width")) topics.add("width");
        if (params.includes("height")) topics.add("height");
        if (params.includes("orientation")) topics.add("orientation");
        if (params.includes("aspect-ratio")) topics.add("window");
      } else if (atRule === "dynamic-style") {
        if (params === "vw") topics.add("width");
        if (params === "vh") topics.add("height");
      }
    }
  }

  return [...topics.values()];
}

export interface NormalizeCssSelectorOptions {
  important?: string | boolean;
}

export function normalizeCssSelector(
  selector: string,
  { important }: NormalizeCssSelectorOptions = {}
) {
  const regex = new RegExp(
    typeof important === "string"
      ? `(^${important}|${commonReplacements})`
      : commonReplacements,
    "g"
  );

  selector = selector.trim().replace(regex, "");
  selector = selector.split("::")[0];

  return selector;
}

export interface StateBitOptions {
  darkMode?: boolean;
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
  groupHover?: boolean;
  groupActive?: boolean;
  groupFocus?: boolean;
  scopedGroupHover?: boolean;
  scopedGroupActive?: boolean;
  scopedGroupFocus?: boolean;
  parentHover?: boolean;
  parentFocus?: boolean;
  parentActive?: boolean;
  platform?: typeof Platform.OS;
}

export function getStateBit({
  darkMode = false,
  hover = false,
  focus = false,
  active = false,
  groupHover = false,
  groupFocus = false,
  groupActive = false,
  scopedGroupHover = false,
  scopedGroupFocus = false,
  scopedGroupActive = false,
  parentHover = false,
  parentFocus = false,
  parentActive = false,
  platform,
}: StateBitOptions = {}) {
  let finalBit = 0;

  let bitLevel = 1;

  for (const value of [
    hover,
    active,
    focus,
    groupHover,
    groupActive,
    groupFocus,
    scopedGroupHover,
    scopedGroupActive,
    scopedGroupFocus,
    parentHover,
    parentActive,
    parentFocus,
    platform === "android",
    platform === "ios",
    platform === "web",
    platform === "windows",
    platform === "macos",
    darkMode,
  ]) {
    if (value) finalBit |= bitLevel;
    bitLevel = bitLevel * 2;
  }

  return finalBit;
}

export function createAtRuleSelector(className: string, atRuleIndex: number) {
  return `${className}@${atRuleIndex}`;
}

export function css(...strings: TemplateStringsArray[]) {
  return normalizeCssSelector(strings[0].raw[0]);
}

const makePseudoClassTest = (pseudoClass: string) => {
  const regex = new RegExp(`\\w+(::${pseudoClass})(:|\\b)`);
  return regex.test.bind(regex);
};

export const hasDarkPseudoClass = makePseudoClassTest("dark");
