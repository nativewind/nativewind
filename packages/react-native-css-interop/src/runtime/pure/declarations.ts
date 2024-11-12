import {
  buildAnimationSideEffects,
  type AnimationAttributes,
} from "./animations";
import { styleFamily } from "./globals";
import type { ConfigReducerState } from "./state/config";
import { TransitionAttributes, TransitionDeclarations } from "./transitions";
import type { Props, RenderGuard, SideEffectTrigger, StyleRule } from "./types";
import type { Effect } from "./utils/observable";

export type Declarations = Effect &
  TransitionDeclarations & {
    epoch: number;
    normal?: StyleRule[];
    important?: StyleRule[];
    guards: RenderGuard[];
    animation?: AnimationAttributes[];
    sideEffects?: SideEffectTrigger[];
  };

type DeclarationUpdates = {
  d?: boolean;
  a?: boolean;
  t?: TransitionAttributes[];
};

export function buildDeclarations(
  state: ConfigReducerState,
  props: Props,
  run: () => void,
): Declarations {
  const previous = state.declarations;
  const source = props?.[state.config.source] as string | undefined;

  const next: Declarations = {
    epoch: previous?.epoch ?? 0,
    guards: [{ type: "prop", name: state.config.source, value: source }],
    run,
    dependencies: new Set(),
    get(readable) {
      return readable.get(next);
    },
  };

  if (!source) {
    return next;
  }

  let updates: DeclarationUpdates | undefined;

  for (const className of source.split(/\s+/)) {
    const styleRuleSet = next.get(styleFamily(className));
    if (!styleRuleSet) {
      continue;
    }

    updates = collectRules("normal", updates, styleRuleSet.n, next, previous);
    updates = collectRules(
      "important",
      updates,
      styleRuleSet.i,
      next,
      previous,
    );
  }

  if (updates) {
    // If a rule or animation property changed, increment the epoch
    next.epoch++;

    // If the animation's changed, then we need to update the animation side effects
    if (updates.a) {
      buildAnimationSideEffects(next, previous);
    }

    if (updates.t?.length) {
      // Flatten the transition attributes
      next.transition = Object.assign({}, ...updates.t);
    }
  }

  return next;
}

/**
 * Mutates the collection with valid style rules
 * @param styleRules
 * @param collection
 * @returns
 */
function collectRules(
  key: "normal" | "important",
  updates: DeclarationUpdates | undefined,
  styleRules: StyleRule[] | undefined,
  next: Declarations,
  previous: Declarations | undefined,
) {
  if (!styleRules) {
    if (previous?.[key] !== undefined) {
      updates ??= {};
      updates.d = true;
    }
    return updates;
  }

  let aIndex = next.animation ? Math.max(0, next.animation.length - 1) : 0;
  let dIndex = next[key] ? Math.max(0, next[key].length - 1) : 0;

  for (const rule of styleRules) {
    if (!testRule(rule)) continue;

    if (rule.a) {
      next.animation ??= [];
      next.animation.push(rule.a);
      /**
       * Changing any animation property will restart all animations
       * TODO: This is not entirely accurate, Chrome does not restart animations
       *       This is fine during this experimental stage, but we should fix this in the future
       */
      updates ??= {};
      updates.a ||= !Object.is(previous?.animation?.[aIndex], rule.a);
      aIndex++;
    }

    if (rule.t) {
      updates ??= {};
      updates.t ||= [];
      updates.t.push(rule.t);
      aIndex++;
    }

    if (rule.d) {
      next[key] ??= [];
      next[key].push(rule);
      updates ??= {};
      updates.d ||= !Object.is(previous?.[key]?.[dIndex], rule);
      dIndex++;
    }
  }

  return updates;
}

function testRule(styleRule: StyleRule) {
  return true;
}
