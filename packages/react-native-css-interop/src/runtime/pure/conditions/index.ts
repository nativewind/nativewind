import { activeFamily, focusFamily, hoverFamily } from "../globals";
import { PseudoClassesQuery, StyleRule } from "../types";
import { Effect } from "../utils/observable";

export function testRule(
  styleRule: StyleRule,
  weakKey: WeakKey,
  effect: Effect,
) {
  if (styleRule.p && !testPseudoClasses(styleRule.p, weakKey, effect)) {
    return false;
  }
  return true;
}

function testPseudoClasses(
  query: PseudoClassesQuery,
  weakKey: WeakKey,
  effect: Effect,
) {
  if (query.h && !effect.get(hoverFamily(weakKey))) {
    return false;
  }
  if (query.a && !effect.get(activeFamily(weakKey))) {
    return false;
  }
  if (query.f && !effect.get(focusFamily(weakKey))) {
    return false;
  }
  return true;
}
