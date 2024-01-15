import { useEffect, useMemo, useState } from "react";
import {
  SharedValue,
  makeMutable,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import type {
  RuntimeStyleRuleSet,
  StyleRule,
  RuntimeStyleRule,
  ExtractedAnimations,
  ExtractedTransition,
  StyleDeclaration,
  AttributeDependency,
  PropAccumulator,
  InteropComponentConfig,
} from "../../types";
import {
  defaultValues,
  getEasing,
  parseValue,
  resolveAnimation,
  setDeepStyle,
  timeToMS,
} from "./resolve-value";
import { cleanupEffect, type Effect } from "../observable";
import type { ComponentState } from "../api.native";
import { StyleSheet, animationMap, opaqueStyles } from "./stylesheet";
import { testAttributesChanged, testRule } from "./conditions";
import { globalVariables } from "./globals";

export type PropState = Effect & {
  resetContext: boolean;
  attributes: AttributeDependency[];
  isAnimated: boolean;
  sharedValues: Map<string, SharedValue<any>>;
  animationNames: Set<string>;
  animationWaitingOnLayout: boolean;
};

export function usePropState(
  componentState: ComponentState,
  originalProps: Record<string, any>,
  config: InteropComponentConfig,
) {
  const [state, setState] = useState<PropState>(() => {
    return {
      dependencies: new Set(),
      attributes: [],
      resetContext: false,
      animationNames: new Set(),
      animationWaitingOnLayout: true,
      sharedValues: new Map(),
      isAnimated: false,
      rerender: () => {
        setState((state) => ({ ...state }));
      },
    };
  });

  useEffect(() => () => cleanupEffect(state), []);

  const { source, target, nativeStyleToProp } = config;
  const classNames = originalProps[source];
  const inlineStyles = originalProps[target];

  /**
   * If the attributes changes, reset the tracking array. This will cause the useMemo to re-run
   */
  if (testAttributesChanged(originalProps, state.attributes)) {
    state.attributes = [];
  }

  return useMemo(() => {
    // Clean up from the previous render
    cleanupEffect(state);

    const hasContext = Boolean(componentState.context);

    const ruleSets: RuntimeStyleRuleSet = {
      normal: [],
      inline: [],
      important: [],
    };

    const acc: PropAccumulator = {
      effect: state,
      isAnimated: state.isAnimated,
      target,
      resetContext: false,
      props: {},
      variables: new Map(),
      containerNames: [],
      animationValues: {},
      requiresLayout: false,
      delayedDeclarations: [],
      getWidth() {
        return (
          acc.props[target]?.width || componentState.getLayout(state)?.[0] || 0
        );
      },
      getHeight() {
        return (
          acc.props[target]?.height || componentState.getLayout(state)?.[1] || 0
        );
      },
      getFontSize() {
        return acc.props[target]?.fontSize || 14;
      },
      getVariable(name) {
        if (!name) return;
        let value: any = undefined;
        value ??= acc.variables.get(name);
        value ??= globalVariables.universal.get(name)?.get(state);
        value ??= componentState.parent.getVariable(name, state);
        return parseValue(acc, value);
      },
    };

    function mergeRules(
      rules: StyleRule[] | undefined,
      destination: RuntimeStyleRuleSet["normal"],
    ) {
      if (!rules) return;
      for (const rule of rules) {
        if (!hasContext && Boolean(rule.variables || rule.container)) {
          acc.resetContext = true;
        }
        if (testRule(state, componentState, rule, originalProps)) {
          destination.push(rule);
        }
      }
    }

    if (typeof classNames === "string") {
      for (const className of classNames.split(/\s+/)) {
        const ruleSet = StyleSheet.getGlobalStyle(className)?.get(state);
        if (ruleSet && "$$type" in ruleSet) {
          mergeRules(ruleSet?.normal, ruleSets.normal);
          mergeRules(ruleSet?.important, ruleSets.important);
        } else if (ruleSet) {
          ruleSets.normal.push(ruleSet);
        }
      }
    }

    if (inlineStyles) {
      if (Array.isArray(inlineStyles)) {
        for (let style of inlineStyles.flat(10)) {
          if (opaqueStyles.has(style)) {
            const ruleSet = opaqueStyles.get(style)!;
            mergeRules(ruleSet?.normal, ruleSets.inline); // Upgrade normal to inline
            mergeRules(ruleSet?.inline, ruleSets.inline);
            mergeRules(ruleSet?.important, ruleSets.important);
          } else if (style) {
            ruleSets.inline.push(style);
          }
        }
      } else if (opaqueStyles.has(inlineStyles)) {
        const ruleSet = opaqueStyles.get(inlineStyles)!;
        mergeRules(ruleSet?.normal, ruleSets.normal); // Upgrade normal to inline
        mergeRules(ruleSet?.inline, ruleSets.inline);
        mergeRules(ruleSet?.important, ruleSets.important);
      } else {
        ruleSets.inline.push(inlineStyles);
      }
    }

    reduceStyles(acc, ruleSets.normal, target);
    reduceStyles(acc, ruleSets.inline, target, true);
    reduceStyles(acc, ruleSets.important, target, true);

    // Apply the delayed declarations, these are styles that rely on other styles
    for (const declaration of acc.delayedDeclarations) {
      applyDeclaration(acc, declaration, false);
    }

    if (target === "style") {
      const seenAnimatedProps = new Set();

      if (acc.animation) {
        const {
          name: animationNames,
          duration: durations,
          delay: delays,
          iterationCount: iterationCounts,
          timingFunction: easingFuncs,
        } = acc.animation;

        state.isAnimated = true;
        originalProps.style ??= {};
        let names: string[] = [];

        // Always reset if we are waiting on an animation
        let shouldResetAnimations = state.animationWaitingOnLayout;

        for (const name of animationNames) {
          if (name.type === "none") {
            names = [];
            state.animationNames.clear();
            break;
          }

          names.push(name.value);

          if (
            state.animationNames.size === 0 || // If there were no previous animations
            !state.animationNames.has(name.value) // Or there is a new animation
          ) {
            shouldResetAnimations = true; // Then reset everything
          }
        }

        /**
         * Animations should only be updated if the animation name changes
         */
        if (shouldResetAnimations) {
          state.animationNames.clear();
          state.animationWaitingOnLayout = false;

          // Loop in reverse order
          for (let index = names.length - 1; index >= 0; index--) {
            const name = names[index % names.length];
            state.animationNames.add(name);

            const animation = animationMap.get(name);
            if (!animation) {
              continue;
            }

            const totalDuration = timeToMS(durations[index % name.length]);
            const delay = timeToMS(delays[index % delays.length]);
            const easingFunction = easingFuncs[index % easingFuncs.length];
            const iterations = iterationCounts[index % iterationCounts.length];

            for (const frame of animation.frames) {
              const animationKey = frame[0];
              const values = frame[1].values;
              const pathTokens = frame[1].pathTokens;

              if (seenAnimatedProps.has(animationKey)) continue;
              seenAnimatedProps.add(animationKey);

              const [initialValue, ...sequence] = resolveAnimation(
                acc,
                values,
                animationKey,
                acc.animationValues,
                delay,
                totalDuration,
                easingFunction,
              );

              if (
                animation.requiresLayoutWidth ||
                animation.requiresLayoutHeight
              ) {
                const layout = componentState.getLayout(state);
                const needWidth =
                  animation.requiresLayoutWidth &&
                  originalProps.style?.width === undefined &&
                  layout?.[0] === undefined;

                const needHeight =
                  animation.requiresLayoutHeight &&
                  originalProps.style?.height === undefined &&
                  layout?.[1] === undefined;

                if (needWidth || needHeight) {
                  acc.requiresLayout = true;
                  state.animationWaitingOnLayout = true;
                }
              }

              let sharedValue = state.sharedValues.get(animationKey);
              if (!sharedValue) {
                sharedValue = makeMutable(initialValue);
                state.sharedValues.set(animationKey, sharedValue);
              } else {
                sharedValue.value = initialValue;
              }

              sharedValue.value = withRepeat(
                withSequence(...sequence),
                iterations.type === "infinite" ? -1 : iterations.value,
              );

              setDeepStyle(acc, pathTokens, sharedValue);
            }
          }
        } else {
          for (const name of names) {
            const keyframes = animationMap.get(name);
            if (!keyframes) continue;

            acc.props[target] ??= {};

            for (const [animationKey] of keyframes.frames) {
              acc.props[target][animationKey] =
                state.sharedValues.get(animationKey);
              seenAnimatedProps.add(animationKey);
            }
          }
        }
      }

      if (acc.transition) {
        state.isAnimated = true;

        const {
          property: properties,
          duration: durations,
          delay: delays,
          timingFunction: timingFunctions,
        } = acc.transition;

        /**
         * If there is a 'none' transition we should skip this logic.
         * In the sharedValues cleanup step the animation will be cancelled as the properties were not seen.
         */
        if (!properties.includes("none")) {
          for (let index = 0; index < properties.length; index++) {
            const property = properties[index];

            if (seenAnimatedProps.has(property)) continue;

            let value =
              acc.animationValues[property] ??
              acc.props[target]?.[property] ??
              defaultValues[property];

            seenAnimatedProps.add(property);

            const duration = timeToMS(durations[index % durations.length]);
            const delay = timeToMS(delays[index % delays.length]);
            const easing = timingFunctions[index % timingFunctions.length];

            let sharedValue = state.sharedValues.get(property);
            if (!sharedValue) {
              sharedValue = makeMutable(value);
              state.sharedValues.set(property, sharedValue);
            }

            if (value !== sharedValue.value) {
              sharedValue.value = withDelay(
                delay,
                withTiming(value, {
                  duration,
                  easing: getEasing(easing),
                }),
              );
            }

            acc.props[target][property] = sharedValue;
          }
        }
      }

      /**
       * If a sharedValue is not 'seen' by an animation or transition it should have it's animation cancelled
       * and value reset to the current type or default value.
       */
      for (const [key, value] of state.sharedValues) {
        if (seenAnimatedProps.has(key)) continue;
        value.value = acc.props[target][key] ?? defaultValues[key];
      }
    }

    if (target === "style" && nativeStyleToProp) {
      for (let move of Object.entries(nativeStyleToProp)) {
        const source = move[0];
        const sourceValue = acc.props[target]?.[source];
        if (sourceValue === undefined) continue;
        const targetProp = move[1] === true ? move[0] : move[1];
        acc.props[targetProp] = sourceValue;
        delete acc.props[target][source];
      }
    }

    acc.isAnimated = state.isAnimated;

    return acc;
  }, [componentState, state, classNames, inlineStyles, state.attributes]);
}

function reduceStyles(
  acc: PropAccumulator,
  rules: RuntimeStyleRule[],
  target: string,
  inline?: boolean,
) {
  rules.sort((a, b) => specificityCompare(a, b, inline));

  for (let rule of rules) {
    // A declaration must have specificity, while an inline style will not
    if (!("$$type" in rule) || rule.$$type !== "StyleRule") {
      acc.props[target] ??= {};
      Object.assign(acc.props[target], rule);
      continue;
    }

    if (rule.variables) {
      for (const variable of rule.variables) {
        acc.variables.set(variable[0], variable[1]);
      }
    }

    if (rule.container) {
      if (rule.container.type === "normal" || rule.container.names === false) {
        acc.containerNames = null; // null means 'remove'
      } else if (rule.container.names) {
        acc.containerNames ??= [];
        acc.containerNames.push(...rule.container.names);
      }
    }

    if (rule.animations) {
      acc.animation ??= { ...defaultAnimation };
      Object.assign(acc.animation, rule.animations);
    }

    if (rule.transition) {
      acc.transition ??= { ...defaultTransition };
      Object.assign(acc.transition, rule.transition);
    }

    if (rule.declarations) {
      for (const declaration of rule.declarations) {
        applyDeclaration(acc, declaration);
      }
    }
  }
}

function applyDeclaration(
  acc: PropAccumulator,
  declaration: StyleDeclaration,
  queueDelayedDeclarations = true,
) {
  if (declaration.length === 2) {
    // This is a static shallow declaration that can just be merged
    const target = declaration[0] === "style" ? acc.target : declaration[0];
    acc.props[target] ??= {};
    Object.assign(acc.props[target], declaration[1]);
  } else {
    const value = declaration[2];

    if (queueDelayedDeclarations && typeof value === "object" && value.delay) {
      acc.delayedDeclarations.push(declaration);
    } else {
      const animationKey = declaration[0];
      const pathTokens = [...declaration[1]];

      if (acc.target !== "style" && pathTokens[0] === "style") {
        pathTokens[0] = acc.target;
      }
      acc.animationValues[animationKey] = value;
      setDeepStyle(acc, pathTokens, value);
    }
  }
}

export function specificityCompare(
  o1?: object | StyleRule | null,
  o2?: object | StyleRule | null,
  treatAsInline = false,
) {
  if (!o1) return -1;
  if (!o2) return 1;

  // inline styles have no specificity and the order is preserved
  if (!("specificity" in o1) || !("specificity" in o2)) {
    return 0;
  }

  const a = o1.specificity;
  const b = o2.specificity;

  if (a.I !== b.I) {
    return a.I - b.I; /* Important */
  } else if (!treatAsInline && a.inline !== b.inline) {
    return (a.inline || 0) - (b.inline || 0); /* Inline */
  } else if (a.A !== b.A) {
    return a.A - b.A; /* Ids */
  } else if (a.B !== b.B) {
    // Classes
    return a.B - b.B;
  } else if (a.C !== b.C) {
    // Styles
    return a.C - b.C;
  } else if (a.S !== b.S) {
    // StyleSheet Order
    return a.S - b.S;
  } else if (a.O !== b.O) {
    // Appearance Order
    return a.O - b.O;
  } else {
    // They are the same
    return 0;
  }
}

const defaultAnimation: Required<ExtractedAnimations> = {
  name: [],
  direction: ["normal"],
  fillMode: ["none"],
  iterationCount: [{ type: "number", value: 1 }],
  timingFunction: [{ type: "linear" }],
  playState: ["running"],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
};

const defaultTransition: Required<ExtractedTransition> = {
  property: [],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
  timingFunction: [{ type: "linear" }],
};
