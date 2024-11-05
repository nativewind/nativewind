import {
  buildAnimationSideEffects,
  type AnimationAttributes,
} from "./animations";
import { styleFamily } from "./globals";
import type { ConfigReducerState } from "./state/config";
import { TransitionAttributes, TransitionDeclarations } from "./transitions";
import type { RenderGuard, SideEffectTrigger, StyleRule } from "./types";
import type { Effect } from "./utils/observable";

export type Declarations = Effect &
  TransitionDeclarations & {
    epoch: number;
    defaultStyle?: Record<string, any>;
    normal: StyleRule[];
    important: StyleRule[];
    guards: RenderGuard[];
    animation?: AnimationAttributes[];
    sideEffects?: SideEffectTrigger[];
  };

type DeclarationUpdates = {
  rules?: boolean;
  animation?: boolean;
  transition?: boolean;
};

export function buildDeclarations(
  state: ConfigReducerState,
  props: Record<string, any>,
  run: () => void,
): Declarations {
  const previous = state.declarations;
  const source = props[state.config.source] as string;

  const next: Declarations = {
    epoch: previous ? previous.epoch : 0,
    normal: [],
    important: [],
    guards: [{ type: "prop", name: state.config.source, value: source }],
    run,
    dependencies: new Set(),
    get(readable) {
      return readable.get(next);
    },
  };

  let updates: DeclarationUpdates = {};
  const transitions: TransitionAttributes[] = [];

  for (const className of source.split(/\s+/)) {
    const styleRuleSet = next.get(styleFamily(className));
    if (!styleRuleSet) {
      continue;
    }

    updates = collectRules(
      updates,
      styleRuleSet.n,
      next,
      previous,
      next.normal,
      transitions,
      previous?.normal,
    );
    updates = collectRules(
      updates,
      styleRuleSet.i,
      next,
      previous,
      next.important,
      transitions,
      previous?.important,
    );
  }

  if (updates.rules || updates.animation || transitions.length) {
    // If a rule or animation property changed, increment the epoch
    next.epoch++;

    // If the animation's changed, then we need to update the animation side effects
    if (updates.animation) {
      buildAnimationSideEffects(next, previous);
    }

    if (transitions.length) {
      next.transition = Object.assign({}, ...transitions);
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
  updates: DeclarationUpdates,
  styleRules: StyleRule[] | undefined,
  next: Declarations,
  previous: Declarations | undefined,
  collection: StyleRule[],
  transitions: TransitionAttributes[],
  previousCollection?: StyleRule[],
) {
  if (!styleRules) {
    updates.rules ||= previousCollection !== undefined;
    return updates;
  }

  let collectionIndex = Math.max(0, collection.length - 1);
  let aIndex = next.animation ? Math.max(0, next.animation.length - 1) : 0;

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
      updates.animation ||= !Object.is(previous?.animation?.[aIndex], rule.a);
      aIndex++;
    }

    if (rule.t) {
      transitions.push(rule.t);
      aIndex++;
    }

    collection.push(rule);
    updates.rules ||= Object.is(previousCollection?.[collectionIndex], rule);
    collectionIndex++;
  }

  return updates;
}

function testRule(styleRule: StyleRule) {
  return true;
}
