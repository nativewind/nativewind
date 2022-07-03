import type { PlatformOSType } from "react-native";

/* prettier-ignore */ export const PARENT_FOCUS     = 0b1000000000000000000000;
/* prettier-ignore */ export const PARENT_HOVER     = 0b0100000000000000000000;
/* prettier-ignore */ export const PARENT_ACTIVE    = 0b0010000000000000000000;
/* prettier-ignore */ export const ISO_GROUP_FOCUS  = 0b0001000000000000000000;
/* prettier-ignore */ export const ISO_GROUP_HOVER  = 0b0000100000000000000000;
/* prettier-ignore */ export const ISO_GROUP_ACTIVE = 0b0000010000000000000000;
/* prettier-ignore */ export const GROUP_FOCUS      = 0b0000001000000000000000;
/* prettier-ignore */ export const GROUP_HOVER      = 0b0000000100000000000000;
/* prettier-ignore */ export const GROUP_ACTIVE     = 0b0000000010000000000000;
/* prettier-ignore */ export const PARENT           = 0b0000000001000000000000;
/* prettier-ignore */ export const GROUP_ISO        = 0b0000000000100000000000;
/* prettier-ignore */ export const GROUP            = 0b0000000000010000000000;
/* prettier-ignore */ export const FOCUS            = 0b0000000000001000000000;
/* prettier-ignore */ export const HOVER            = 0b0000000000000100000000;
/* prettier-ignore */ export const ACTIVE           = 0b0000000000000010000000;
/* prettier-ignore */ export const RTL              = 0b0000000000000001000000;
/* prettier-ignore */ export const OSX              = 0b0000000000000000100000;
/* prettier-ignore */ export const WINDOWS          = 0b0000000000000000010000;
/* prettier-ignore */ export const WEB              = 0b0000000000000000001000;
/* prettier-ignore */ export const ANDROID          = 0b0000000000000000000100;
/* prettier-ignore */ export const IOS              = 0b0000000000000000000010;
/* prettier-ignore */ export const DARK_MODE        = 0b0000000000000000000001;

const makePseudoClassTest = (pseudoClass: string) => {
  const regex = new RegExp(`\\S+::${pseudoClass}(:|\\s|$)`);
  return regex.test.bind(regex);
};

const hasHover = makePseudoClassTest("hover");
const hasActive = makePseudoClassTest("active");
const hasFocus = makePseudoClassTest("focus");
const hasGroupHover = makePseudoClassTest("group-hover");
const hasGroupActive = makePseudoClassTest("group-active");
const hasGroupFocus = makePseudoClassTest("group-focus");
const hasGroupIsolate = RegExp.prototype.test.bind(
  /(:|\s|^)group-isolate(:|\s|^)/gi
);
const hasGroupIsolateHover = makePseudoClassTest("group-isolate-hover");
const hasGroupIsolateActive = makePseudoClassTest("group-isolate-active");
const hasGroupIsolateFocus = makePseudoClassTest("group-isolate-focus");
const hasParent = RegExp.prototype.test.bind(/(:|\s|^)parent(:|\s|$)/gi);

const hasParentHover = makePseudoClassTest("parent-hover");
const hasParentActive = makePseudoClassTest("parent-active");
const hasParentFocus = makePseudoClassTest("parent-focus");
const hasIos = makePseudoClassTest("ios");
const hasAndroid = makePseudoClassTest("android");
const hasWindows = makePseudoClassTest("windows");
const hasMacos = makePseudoClassTest("macos");
const hasWeb = makePseudoClassTest("web");
export const hasDarkPseudoClass = makePseudoClassTest("dark");

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
  group?: boolean;
  groupHover?: boolean;
  groupActive?: boolean;
  groupFocus?: boolean;
  isolateGroup?: boolean;
  isolateGroupHover?: boolean;
  isolateGroupActive?: boolean;
  isolateGroupFocus?: boolean;
  parent?: boolean;
  parentHover?: boolean;
  parentFocus?: boolean;
  parentActive?: boolean;
  platform?: PlatformOSType;
  rtl?: boolean;

  // Used By expo-snack
  baseBit?: number;
}

export function getStateBit(options: StateBitOptions = {}) {
  let finalBit = options.baseBit || 0;

  if (options.darkMode) finalBit |= DARK_MODE;
  if (options.platform === "ios") finalBit |= IOS;
  if (options.platform === "android") finalBit |= ANDROID;
  if (options.platform === "web") finalBit |= WEB;
  if (options.platform === "windows") finalBit |= WINDOWS;
  if (options.platform === "macos") finalBit |= OSX;
  if (options.rtl) finalBit |= RTL;
  if (options.active) finalBit |= ACTIVE;
  if (options.hover) finalBit |= HOVER;
  if (options.focus) finalBit |= FOCUS;
  if (options.group) finalBit |= GROUP;
  if (options.groupActive) finalBit |= GROUP_ACTIVE;
  if (options.groupHover) finalBit |= GROUP_HOVER;
  if (options.groupFocus) finalBit |= GROUP_FOCUS;
  if (options.isolateGroup) finalBit |= GROUP_ISO;
  if (options.isolateGroupActive) finalBit |= ISO_GROUP_ACTIVE;
  if (options.isolateGroupHover) finalBit |= ISO_GROUP_HOVER;
  if (options.isolateGroupFocus) finalBit |= ISO_GROUP_FOCUS;
  if (options.parent) finalBit |= PARENT;
  if (options.parentActive) finalBit |= PARENT_ACTIVE;
  if (options.parentHover) finalBit |= PARENT_HOVER;
  if (options.parentFocus) finalBit |= PARENT_FOCUS;

  return finalBit;
}

export function createAtRuleSelector(className: string, atRuleIndex: number) {
  return `${className}@${atRuleIndex}`;
}

export function matchesMask(value: number, mask: number): boolean {
  return (value & mask) === mask;
}

export function getSelectorMask(selector: string, rtl = false): number {
  return getStateBit({
    rtl,
    hover: hasHover(selector),
    active: hasActive(selector),
    focus: hasFocus(selector),
    groupHover: hasGroupHover(selector),
    groupActive: hasGroupActive(selector),
    groupFocus: hasGroupFocus(selector),
    isolateGroup: hasGroupIsolate(selector),
    isolateGroupHover: hasGroupIsolateHover(selector),
    isolateGroupActive: hasGroupIsolateActive(selector),
    isolateGroupFocus: hasGroupIsolateFocus(selector),
    parent: hasParent(selector),
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
