import { getAnimationIO, type SharedValueInterpolation } from "./animations";
import type { ContainerContextValue, VariableContextValue } from "./contexts";
import type { ResolveOptions } from "./resolvers";
import { resolveValue } from "./resolvers";
import type { ConfigReducerState } from "./state/config";
import type {
  Callback,
  RenderGuard,
  SideEffectTrigger,
  StyleRule,
  StyleValueDescriptor,
} from "./types";
import { Effect } from "./utils/observable";
import { setValue } from "./utils/properties";

export type Styles = Effect & {
  epoch: number;
  guards: RenderGuard[];
  props?: Record<string, any>;
  sideEffects?: SideEffectTrigger[];
  animationIO?: SharedValueInterpolation[];
};

export function buildStyles(
  state: ConfigReducerState,
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
  run: () => void,
) {
  const styles: Styles = {
    epoch: state.styles ? state.styles.epoch : -1,
    guards: [],
    run,
    dependencies: new Set(),
    get(readable) {
      return readable.get(styles);
    },
  };

  const next: ConfigReducerState = {
    ...state,
    styles,
  };

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

  if (state.declarations?.normal) {
    styles.props = applyStyles(
      styles.props,
      state.declarations?.normal,
      state,
      delayedStyles,
      resolveOptions,
    );
  }

  styles.animationIO = getAnimationIO(state, styles, resolveOptions);

  if (state.declarations?.important) {
    styles.props = applyStyles(
      styles.props,
      state.declarations?.important,
      state,
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

function applyStyles(
  props: Record<string, any> | undefined,
  styleRules: StyleRule[],
  state: ConfigReducerState,
  delayedStyles: Callback[],
  resolveOptions: ResolveOptions,
) {
  for (const styleRule of styleRules) {
    if (styleRule.d) {
      for (const declaration of styleRule.d) {
        if (Array.isArray(declaration)) {
          let value: any = declaration[0];

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
                value = resolveValue(state, originalValue, resolveOptions);
                setValue(props, declaration[1], value, state, placeholder);
              });
            } else {
              value = resolveValue(state, value, resolveOptions);
            }
          }

          // This mutates and/or creates the props object
          props = setValue(props, declaration[1], value, state);
        } else {
          props ??= {};
          props.style ??= {};
          Object.assign(props.style, declaration);
        }
      }
    }
  }

  return props;
}
