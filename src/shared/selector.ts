import { Platform } from "react-native";
import { AtRuleTuple, Style } from "../types/common";

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

export function normalizeCssSelector(selector: string) {
  selector = selector.trim().replace(/^\.|\\/g, "");
  selector = selector.split("::")[0];
  selector = selector.split(" ").pop() as string;

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
  isolateGroupHover?: boolean;
  isolateGroupActive?: boolean;
  isolateGroupFocus?: boolean;
  parentHover?: boolean;
  parentFocus?: boolean;
  parentActive?: boolean;
  platform?: typeof Platform.OS;
  rtl?: boolean;

  // Used By expo-snack
  baseBit?: number;
}

export function getStateBit({
  darkMode = false,
  hover = false,
  focus = false,
  active = false,
  groupHover = false,
  groupFocus = false,
  groupActive = false,
  isolateGroupHover = false,
  isolateGroupFocus = false,
  isolateGroupActive = false,
  parentHover = false,
  parentFocus = false,
  parentActive = false,
  rtl = false,
  platform,
  baseBit = 0,
}: StateBitOptions = {}) {
  let finalBit = baseBit;

  let bitLevel = 1;

  for (const value of [
    hover,
    active,
    focus,
    groupHover,
    groupActive,
    groupFocus,
    isolateGroupHover,
    isolateGroupActive,
    isolateGroupFocus,
    parentHover,
    parentActive,
    parentFocus,
    platform === "android",
    platform === "ios",
    platform === "web",
    platform === "windows",
    platform === "macos",
    darkMode,
    rtl,
  ]) {
    if (value) finalBit |= bitLevel;
    bitLevel = bitLevel * 2;
  }

  return finalBit;
}

export function createAtRuleSelector(className: string, atRuleIndex: number) {
  return `${className}@${atRuleIndex}`;
}

const makePseudoClassTest = (pseudoClass: string) => {
  const regex = new RegExp(`\\w+(::${pseudoClass})(:|\\b)`);
  return regex.test.bind(regex);
};

export const hasHover = makePseudoClassTest("hover");
export const hasActive = makePseudoClassTest("active");
export const hasFocus = makePseudoClassTest("focus");
export const hasGroupHover = makePseudoClassTest("group-hover");
export const hasGroupActive = makePseudoClassTest("group-active");
export const hasGroupFocus = makePseudoClassTest("group-focus");
export const hasGroupIsolateHover = makePseudoClassTest("group-isolate-hover");
export const hasGroupIsolateActive = makePseudoClassTest(
  "group-isolate-active"
);
export const hasGroupIsolateFocus = makePseudoClassTest("group-isolate-focus");
export const hasParentHover = makePseudoClassTest("parent-hover");
export const hasParentActive = makePseudoClassTest("parent-active");
export const hasParentFocus = makePseudoClassTest("parent-focus");
export const hasIos = makePseudoClassTest("ios");
export const hasAndroid = makePseudoClassTest("android");
export const hasWindows = makePseudoClassTest("windows");
export const hasMacos = makePseudoClassTest("macos");
export const hasWeb = makePseudoClassTest("web");
export const hasDarkPseudoClass = makePseudoClassTest("dark");
export const hasRtl = RegExp.prototype.test.bind(new RegExp("(^|:|s)rtl:"));

export function getSelectorMask(selector: string, rtl = false): number {
  return getStateBit({
    rtl,
    hover: hasHover(selector),
    active: hasActive(selector),
    focus: hasFocus(selector),
    groupHover: hasGroupHover(selector),
    groupActive: hasGroupActive(selector),
    groupFocus: hasGroupFocus(selector),
    isolateGroupHover: hasGroupIsolateHover(selector),
    isolateGroupActive: hasGroupIsolateActive(selector),
    isolateGroupFocus: hasGroupIsolateFocus(selector),
    parentHover: hasParentHover(selector),
    parentActive: hasParentActive(selector),
    parentFocus: hasParentFocus(selector),
    darkMode: hasDarkPseudoClass(selector),
    platform: hasIos(selector)
      ? "ios"
      : hasAndroid(selector)
      ? "android"
      : hasWindows(selector)
      ? "windows"
      : hasMacos(selector)
      ? "macos"
      : hasWeb(selector)
      ? "web"
      : undefined,
  });
}
