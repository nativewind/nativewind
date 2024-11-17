import type { ContainerContextValue, VariableContextValue } from "./contexts";
import { rootVariables, universalVariables } from "./globals";
import {
  applyAnimation,
  getTransitionSideEffect,
  SharedValueInterpolation,
  TransitionStyles,
} from "./reanimated";
import type { ResolveOptions } from "./resolvers";
import { resolveValue } from "./resolvers";
import type { ConfigReducerState } from "./state/config";
import type {
  Callback,
  Props,
  RenderGuard,
  SideEffectTrigger,
  StyleRule,
  StyleValueDescriptor,
} from "./types";
import { DraftableRecord, Effect } from "./utils/observable";
import { defaultValues, setBaseValue, setValue } from "./utils/properties";

export type Styles = Effect &
  TransitionStyles & {
    epoch: number;
    guards: RenderGuard[];
    baseStyles?: Record<string, any>;
    props?: Record<string, any>;
    sideEffects?: SideEffectTrigger[];
    animationIO?: SharedValueInterpolation[];
  };

export type StateWithStyles = ConfigReducerState & { styles: Styles };

export function buildStyles(
  previous: ConfigReducerState,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
  run: () => void,
) {
  let styles: Styles = {
    epoch: previous.styles ? previous.styles.epoch : -1,
    guards: [],
    run,
    dependencies: new Set(),
    get(readable) {
      return readable.get(styles);
    },
  };

  if (previous.styles?.baseStyles) {
    styles.baseStyles = { ...previous.styles.baseStyles };
  }

  const delayedStyles: Callback[] = [];

  const variables = new DraftableRecord(previous.variables)
    .assignAll(previous.declarations?.variables)
    .commit();

  const next: StateWithStyles = {
    ...previous,
    styles,
    variables,
  };

  const options: ResolveOptions = {
    getProp: (name: string) => {
      styles.guards?.push({
        type: "prop",
        name: name,
        value: incomingProps?.[name],
      });
      return incomingProps?.[name] as StyleValueDescriptor;
    },
    getVariable: (name: string) => {
      let value = resolveValue(next, next.variables?.[name], options);

      // If the value is already defined, we don't need to look it up
      if (value !== undefined) {
        return value;
      }

      // Is there a universal variable?
      value = resolveValue(
        next,
        next.styles.get(universalVariables(name)),
        options,
      );

      // Check if the variable is inherited
      if (value === undefined) {
        for (const inherited of inheritedVariables) {
          if (name in inherited) {
            value = resolveValue(next, inherited[name], options);
            if (value !== undefined) {
              break;
            }
          }
        }

        /**
         * Create a rerender guard incase the variable changes
         */
        styles.guards?.push({
          type: "variable",
          name: name,
          value,
        });
      }

      // This is a bit redundant as inheritedVariables probably is rootVariables,
      // but this ensures a subscription is created for Fast Refresh
      value ??= next.styles.get(rootVariables(name));

      return value;
    },
    getContainer: (name: string) => {
      const value = inheritedContainers[name];
      styles.guards?.push({ type: "container", name: name, value });
      return value;
    },
    previousTransitions: new Set(previous.styles?.transitions?.keys()),
  };

  if (next.declarations?.normal) {
    applyStyles(
      next,
      previous,
      next.declarations?.normal,
      delayedStyles,
      options,
    );
  }

  applyAnimation(next, styles, options);

  if (next.declarations?.important) {
    applyStyles(
      next,
      previous,
      next.declarations?.important,
      delayedStyles,
      options,
    );
  }

  if (delayedStyles.length) {
    for (const delayedStyle of delayedStyles) {
      delayedStyle();
    }
  }

  /**
   * If we had a transition style that was removed,
   * we need to transition back to the default value
   */
  for (let transition of options.previousTransitions) {
    const transitionFn = getTransitionSideEffect(next, previous, transition);

    if (transitionFn) {
      if (typeof transition !== "string") {
        transition = transition[transition.length - 1];
      }
      next.styles.sideEffects ??= [];
      next.styles.sideEffects.push(transitionFn(defaultValues[transition]));
    }
  }

  styles.epoch++;
  return next;
}

/**
 * Mutates `next` to apply the styles from `styleRules`
 */
function applyStyles(
  next: StateWithStyles,
  previous: ConfigReducerState,
  styleRules: StyleRule[],
  delayedStyles: Callback[],
  options: ResolveOptions,
) {
  let props = next.styles.props;

  for (const styleRule of styleRules) {
    if (styleRule.d) {
      for (const declaration of styleRule.d) {
        if (Array.isArray(declaration)) {
          let value: any = declaration[0];
          const propPath = declaration[1];

          const transitionFn = getTransitionSideEffect(
            next,
            previous,
            propPath,
          );

          if (Array.isArray(value)) {
            const shouldDelay = declaration[2];

            if (shouldDelay) {
              /**
               * We need to delay the resolution of this value until after all
               * styles have been calculated. But another style might override
               * this value. So we set a placeholder value and only override
               * if the placeholder is preserved
               *
               * This also ensures the props exist, so setValue will properly
               * mutate the props object and not create a new one
               */
              const originalValue = value;
              value = {};
              delayedStyles.push(() => {
                const placeholder = value;
                value = resolveValue(next, originalValue, options);
                if (transitionFn) {
                  next.styles.sideEffects ??= [];
                  next.styles.sideEffects.push(transitionFn(value));
                } else {
                  setValue(props, propPath, value, next, placeholder);
                }
              });
            } else {
              value = resolveValue(next, value, options);
            }
          }

          // This mutates and/or creates the props object
          if (transitionFn) {
            next.styles.sideEffects ??= [];
            next.styles.sideEffects.push(transitionFn(value));

            next.styles.baseStyles ??= {};
            setBaseValue(next.styles.baseStyles, propPath);

            options.previousTransitions.delete(propPath);
          } else {
            props = setValue(props, propPath, value, next);
          }
        } else {
          props ??= {};
          props.style ??= {};
          Object.assign(props.style, declaration);

          if (next.declarations?.transition?.p?.length) {
            for (const key in declaration) {
              const transitionFn = getTransitionSideEffect(next, previous, key);

              if (transitionFn) {
                next.styles.sideEffects ??= [];
                next.styles.sideEffects.push(transitionFn(declaration[key]));

                next.styles.baseStyles ??= {};
                next.styles.baseStyles[key] = defaultValues[key];
                options.previousTransitions.delete(key);
              }
            }
          }
        }
      }
    }
  }

  next.styles.props = props;
}
