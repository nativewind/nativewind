import type { Platform } from "react-native";

const commonReplacements = `^\\.|\\\\`;

export function normalizeCssSelector(
  selector: string,
  { important }: { important?: string | boolean } = {}
) {
  const regex = new RegExp(
    typeof important === "string"
      ? `(^${important}|${commonReplacements})`
      : commonReplacements,
    "g"
  );

  selector = selector.trim().replace(regex, "");

  let finalBit = 0;

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
  ]) {
    if (new RegExp(`\\w+(::${test})(:|\\b)`).test(selector)) {
      finalBit = finalBit | bitLevel;
    }

    bitLevel = bitLevel * 2;
  }

  selector = selector.split("::")[0];

  return `${selector}.${finalBit}`;
}

export interface CreateSelectorOptions {
  darkMode?: boolean;
  composed?: boolean;
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

export function createNormalizedSelector(
  selector: string,
  {
    darkMode = false,
    composed = false,
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
  }: CreateSelectorOptions = {}
) {
  let finalBit = 0;

  let bitLevel = 1;

  const platformPrefix = hasPlatformPrefix(selector);

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
    platformPrefix && platform === "android",
    platformPrefix && platform === "ios",
    platformPrefix && platform === "web",
    platformPrefix && platform === "windows",
    platformPrefix && platform === "macos",
    hasDarkPrefix(selector) && darkMode,
  ]) {
    if (value) finalBit |= bitLevel;
    bitLevel = bitLevel * 2;
  }

  return composed ? `(${selector}).${finalBit}` : `${selector}.${finalBit}`;
}

export function createAtRuleSelector(className: string, atRuleIndex: number) {
  return `${className}@${atRuleIndex}`;
}

export interface $Options extends Omit<CreateSelectorOptions, "platform"> {
  atRuleIndex?: number;
  platform?: CreateSelectorOptions["platform"];
}

export function $(...strings: TemplateStringsArray[]) {
  return function ({ atRuleIndex, ...options }: $Options = {}) {
    const selector = createNormalizedSelector(strings[0].raw[0], {
      platform: "ios",
      ...options,
    });

    return typeof atRuleIndex === "number"
      ? createAtRuleSelector(selector, atRuleIndex)
      : selector;
  };
}

export function css(...strings: TemplateStringsArray[]) {
  return normalizeCssSelector(strings[0].raw[0]);
}

export const hasDarkPrefix = RegExp.prototype.test.bind(/(^|\b|\w:)dark:/);
export const hasPlatformPrefix = RegExp.prototype.test.bind(
  /(^|\b|\w:)(ios|android|native|web|windows|macos):/
);
