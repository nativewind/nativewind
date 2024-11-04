import { RawAnimation } from "./animations";
import { animationFamily, styleFamily } from "./globals";
import { StyleDeclaration, StyleRule, StyleRuleSet } from "./types";

export function addStyle(className: string, ruleSet: StyleRuleSet): void;
export function addStyle(className: string, rule: StyleRule): void;
export function addStyle(
  className: string,
  normalDeclarations: StyleDeclaration[] | StyleRule[],
): void;
export function addStyle(
  className: string,
  value: StyleRuleSet | StyleRule | StyleRule[] | StyleDeclaration[],
): void {
  if (Array.isArray(value)) {
    if (isStyleRuleArray(value)) {
      styleFamily(className).set({ n: value });
    } else {
      styleFamily(className).set({ n: [{ s: [0], d: value }] });
    }
  } else if ("s" in value) {
    styleFamily(className).set({ n: [value] });
  } else {
    styleFamily(className).set(value);
  }
}

function isStyleRuleArray(
  value: StyleRule[] | StyleDeclaration[],
): value is StyleRule[] {
  return "s" in value[0];
}

export function addKeyFrames(name: string, keyframes: RawAnimation): void {
  animationFamily(name).set(keyframes);
}
