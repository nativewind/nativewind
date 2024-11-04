import {
  buildAnimationSideEffects,
  type AnimationAttributes,
  type ReanimatedMutable,
} from "./animations";
import { styleFamily } from "./globals";
import type { ConfigReducerState } from "./state/config";
import type { RenderGuard, SideEffectTrigger, StyleRule } from "./types";
import type { Effect } from "./utils/observable";

export type Declarations = Effect & {
  epoch: number;
  defaultStyle?: Record<string, any>;
  normal: StyleRule[];
  important: StyleRule[];
  guards: RenderGuard[];
  animation: AnimationAttributes[];
  sideEffects?: SideEffectTrigger[];
  sharedValues?: Map<string, ReanimatedMutable<any>>;
};

type DeclarationUpdates = {
  rules?: boolean;
  animation?: boolean;
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
    animation: [],
    guards: [{ type: "prop", name: state.config.source, value: source }],
    run,
    dependencies: new Set(),
    get(readable) {
      return readable.get(next);
    },
  };

  let updates: DeclarationUpdates = {};

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
      previous?.normal,
    );
    updates = collectRules(
      updates,
      styleRuleSet.i,
      next,
      previous,
      next.important,
      previous?.important,
    );
  }

  if (updates.rules || updates.animation) {
    // If a rule or animation property changed, increment the epoch
    next.epoch++;

    // If the animation's changed, then we need to update the animation side effects
    if (updates.animation) {
      buildAnimationSideEffects(next, previous);
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
  previousCollection?: StyleRule[],
) {
  if (!styleRules) {
    updates.rules ||= previousCollection !== undefined;
    return updates;
  }

  let collectionIndex = Math.max(0, collection.length - 1);
  let aIndex = Math.max(0, next.animation.length - 1);

  for (const rule of styleRules) {
    if (!testRule(rule)) continue;

    if (rule.a) {
      next.animation.push(rule.a);
      /**
       * Changing any animation property will restart all animations
       * TODO: This is not entirely accurate, Chrome does not restart animations
       *       This is fine during this experimental stage, but we should fix this in the future
       */
      updates.animation ||= !Object.is(previous?.animation[aIndex], rule.a);
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
