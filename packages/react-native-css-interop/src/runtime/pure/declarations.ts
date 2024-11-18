import { testRule } from "./conditions";
import { VariableContextValue } from "./contexts";
import { styleFamily } from "./globals";
import {
  buildAnimationSideEffects,
  TransitionAttributes,
  TransitionDeclarations,
} from "./reanimated";
import type { ConfigReducerState } from "./state/config";
import type {
  Props,
  RenderGuard,
  SideEffectTrigger,
  StyleRule,
  VariableDescriptor,
} from "./types";
import { UseInteropState } from "./useInterop";
import type { Effect } from "./utils/observable";

export type Declarations = Effect &
  TransitionDeclarations & {
    epoch: number;
    normal?: StyleRule[];
    important?: StyleRule[];
    variables?: VariableDescriptor[][];
    guards: RenderGuard[];
    animation?: NonNullable<StyleRule["a"]>[];
    sideEffects?: SideEffectTrigger[];
  };

type DeclarationUpdates = {
  d?: boolean;
  a?: boolean;
  t?: TransitionAttributes[];
  v?: boolean;
};

export function buildDeclarations(
  state: ConfigReducerState,
  componentState: UseInteropState,
  props: Props,
  inheritedVariables: VariableContextValue,
): Declarations {
  const previous = state.declarations;
  const source = props?.[state.source] as string | undefined;

  const next: Declarations = {
    epoch: previous?.epoch ?? 0,
    guards: [{ type: "prop", name: state.source, value: source }],
    run: () => {
      componentState.dispatch([
        { action: { type: "update-definitions" }, index: state.index },
      ]);
    },
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

    updates = collectRules(
      "normal",
      state,
      componentState,
      updates,
      styleRuleSet.n,
      next,
      previous,
    );
    updates = collectRules(
      "important",
      state,
      componentState,
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
      buildAnimationSideEffects(next, previous, inheritedVariables);
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
  state: ConfigReducerState,
  componentState: UseInteropState,
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

  let dIndex = next[key] ? Math.max(0, next[key].length - 1) : 0;
  let aIndex = next.animation ? Math.max(0, next.animation.length - 1) : 0;
  let vIndex = next.variables ? Math.max(0, next.variables.length - 1) : 0;

  for (const rule of styleRules) {
    if (!testRule(rule, componentState.key, next)) continue;

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

    if (rule.v) {
      next.variables ??= [];
      next.variables.push(rule.v);
      updates ??= {};
      updates.v ||= !Object.is(previous?.variables?.[vIndex], rule);
      vIndex++;
    }
  }

  return updates;
}
