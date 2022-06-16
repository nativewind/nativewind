import { Platform } from "react-native";

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

  for (const regex of [
    /\w+(:hover)/,
    /\w+(:active)/,
    /\w+(:focus)/,
    /\w+(:group-hover)/,
    /\w+(:group-active)/,
    /\w+(:group-focus)/,
    /\w+(:group-scoped-hover)/,
    /\w+(:group-scoped-active)/,
    /\w+(:group-scoped-focus)/,
    /\w+(:parent-hover)/,
    /\w+(:parent-active)/,
    /\w+(:parent-focus)/,
    /\w+(:android)/,
    /\w+(:ios)/,
    /\w+(:web)/,
    /\w+(:windows)/,
    /\w+(:macos)/,
  ]) {
    if (regex.test(selector)) {
      finalBit = finalBit | bitLevel;
    }

    bitLevel = bitLevel * 2;
  }

  return `${selector}.${finalBit}`;
}

export interface CreateSelectorOptions {
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
    platform = Platform.OS,
  }: CreateSelectorOptions = {}
) {
  let finalBit = 0;

  let bitLevel = 1;

  const hasPlatformPrefix =
    /(^|\w:)(ios|android|native|web|windows|macos):/.test(selector);

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
    hasPlatformPrefix && platform === "android",
    hasPlatformPrefix && platform === "ios",
    hasPlatformPrefix && platform === "web",
    hasPlatformPrefix && platform === "windows",
    hasPlatformPrefix && platform === "macos",
  ]) {
    if (value) finalBit |= bitLevel;
    bitLevel = bitLevel * 2;
  }

  return composed ? `(${selector}).${finalBit}` : `${selector}.${finalBit}`;
}

export function createAtRuleSelector(className: string, atRuleIndex: number) {
  return `${className}@${atRuleIndex}`;
}

export interface $Options extends CreateSelectorOptions {
  atRuleIndex?: number;
}

export function $(...strings: TemplateStringsArray[]) {
  return function ({ atRuleIndex, ...options }: $Options = {}) {
    const selector = createNormalizedSelector(strings[0].raw[0], options);

    return typeof atRuleIndex === "number"
      ? createAtRuleSelector(selector, atRuleIndex)
      : selector;
  };
}
