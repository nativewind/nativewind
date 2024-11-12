import { applyAnimation, type SharedValueInterpolation } from "./animations";
import type { ContainerContextValue, VariableContextValue } from "./contexts";
import type { ResolveOptions } from "./resolvers";
import { resolveValue } from "./resolvers";
import type { ConfigReducerState } from "./state/config";
import { TransitionStyles } from "./transitions";
import { getTransitionSideEffect } from "./transitions/sideEffects";
import type {
  Callback,
  RenderGuard,
  SideEffectTrigger,
  StyleRule,
  StyleValueDescriptor,
} from "./types";
import { Effect } from "./utils/observable";
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
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
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

  const resolveOptions: ResolveOptions = {
    getProp: (name: string) => {
      styles.guards?.push({
        type: "prop",
        name: name,
        value: incomingProps[name],
      });
      return incomingProps[name] as StyleValueDescriptor;
    },
    getVariable: (name: string) => {
      let value: StyleValueDescriptor;

      value ??=
        universalVariables instanceof Map
          ? universalVariables.get(name)
          : universalVariables?.[name];

      value ??=
        inheritedVariables instanceof Map
          ? inheritedVariables.get(name)
          : inheritedVariables?.[name];

      styles.guards?.push({ type: "variable", name: name, value });

      return value;
    },
    getContainer: (name: string) => {
      const value = inheritedContainers[name];
      styles.guards?.push({ type: "container", name: name, value });
      return value;
    },
  };

  const next: StateWithStyles = {
    ...previous,
    styles,
  };

  if (next.declarations?.normal) {
    styles.props = applyStyles(
      next,
      previous,
      next.declarations?.normal,
      delayedStyles,
      resolveOptions,
    );
  }

  styles = applyAnimation(next, styles, resolveOptions);

  if (next.declarations?.important) {
    styles.props = applyStyles(
      next,
      previous,
      next.declarations?.important,
      delayedStyles,
      resolveOptions,
    );
  }

  if (delayedStyles.length) {
    for (const delayedStyle of delayedStyles) {
      delayedStyle();
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
              }
            }
          }
        }
      }
    }
  }

  return props;
}
