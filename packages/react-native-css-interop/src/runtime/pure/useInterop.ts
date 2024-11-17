import {
  createElement,
  ForwardedRef,
  useContext,
  useDebugValue,
  useEffect,
  useReducer,
  type ComponentType,
  type Dispatch,
} from "react";

import { SharedValue } from "react-native-reanimated";

import { EnableCssInteropOptions } from "../../types";
import type { ContainerContextValue, VariableContextValue } from "./contexts";
import { ContainerContext, VariableContext } from "./contexts";
import {
  animatedComponent,
  SharedValueInterpolation,
  Transition,
} from "./reanimated";
import {
  configReducer,
  type ConfigReducerAction,
  type ConfigReducerState,
} from "./state/config";
import type { Config, Props, SideEffectTrigger } from "./types";
import { useHandlers } from "./useHandlers";
import { cleanupEffect, DraftableArray } from "./utils/observable";

export type UseInteropState = Readonly<{
  key: WeakKey;
  epoch: number;
  dispatch: Dispatch<PerformConfigReducerAction[]>;
  // The type this component will render as.
  type: ComponentType<any>;
  // The props that will be passed to the type.
  props?: Record<string, any>;
  // The results of the config reducers grouped by their key
  configStates: ConfigReducerState[];
  // The variables for each config, grouped by config key
  variables?: VariableContextValue;
  // The containers for each config, grouped by config key
  containers?: ContainerContextValue;
  // The side effects for each config, grouped by config key
  sideEffects?: SideEffectTrigger[];

  sharedValues?: SharedValue<any>[];
  baseStyles?: Record<string, any>;
  animations?: SharedValueInterpolation[];
  transitions?: Transition[];
}>;

export type UseInteropDispatch = UseInteropState["dispatch"];

type PerformConfigReducerAction = Readonly<{
  action: ConfigReducerAction;
  index: number;
}>;

export function useInterop(
  type: ComponentType<any>,
  configStates: ConfigReducerState[],
  initialActions: PerformConfigReducerAction[],
  props: Props,
  ref?: ForwardedRef<any>,
) {
  const inheritedVariables = useContext(VariableContext);
  const inheritedContainers = useContext(ContainerContext);

  const reducerState = useReducer(
    /**
     * Reducers can capture current values, so rebuild the reducer each time
     * This is a performance de-optimization, but it's better than writing
     * to refs or using side effects.
     */
    (state: UseInteropState, actions: PerformConfigReducerAction[]) => {
      return performConfigReducerActions(
        state,
        actions,
        props,
        inheritedVariables,
        inheritedContainers,
      );
    },
    undefined,
    () => {
      return performConfigReducerActions(
        {
          key: {},
          type,
          configStates,
          dispatch: (actions) => dispatch(actions),
          epoch: 0,
        },
        initialActions,
        props,
        inheritedVariables,
        inheritedContainers,
      );
    },
  );

  let state = reducerState[0];
  let dispatch = reducerState[1];

  maybeRerenderComponent(
    state,
    dispatch,
    props,
    inheritedVariables,
    inheritedContainers,
  );

  /**
   * The declarations and styles need to be cleaned up when the component
   * unmounts, as they will hold references to observables.
   *
   * Observables created by this component (e.g hover observables) will be
   * automatically removed as they are weakly referenced, and each component
   * that references them (should only be unmounting children) will remove their
   * reference either on unmount or next rerender.
   */
  useEffect(() => {
    return () => {
      for (const key in state.configStates) {
        const configState = state.configStates[key];
        cleanupEffect(configState.declarations);
        cleanupEffect(configState.styles);
      }
    };
  }, []);

  useDebugValue(state);

  let nextType = state.type;
  let nextProps: Props = { ...props, ...state.props };

  for (const config of state.configStates) {
    if (config.source !== config.target) {
      delete nextProps[config.source];
    }
  }

  nextProps = useHandlers(state, nextProps);

  if (state.animations || state.transitions) {
    nextProps.$$state = state;
  }

  if (state.variables) {
    nextProps = {
      value: state.variables,
      children: createElement(nextType, nextProps),
    };
    nextType = VariableContext.Provider;
  }

  if (state.containers) {
    nextProps = {
      value: state.containers,
      children: createElement(nextType, nextProps),
    };
    nextType = ContainerContext.Provider;
  }

  return createElement(nextType, nextProps);
}

function maybeRerenderComponent(
  state: UseInteropState,
  dispatch: Dispatch<PerformConfigReducerAction[]>,
  props: Props,
  variables: VariableContextValue,
  containers: ContainerContextValue,
) {
  const declarationSet = new Set<ConfigReducerState>();
  const styleSet = new Set<ConfigReducerState>();

  for (const configState of state.configStates) {
    const shouldRerenderDeclarations = configState.declarations?.guards?.some(
      (guard) => {
        switch (guard.type) {
          case "prop":
            return props?.[guard.name] !== guard.value;
          case "variable":
            return variables.find((variable) => {
              return (
                guard.name in variable && variable[guard.name] !== guard.value
              );
            });
          case "container":
            return containers[guard.name] !== guard.value;
          default:
            guard satisfies never;
        }
      },
    );

    if (shouldRerenderDeclarations) {
      declarationSet.add(configState);
    }

    const shouldRerenderStyles =
      configState.styles?.guards &&
      configState.styles.guards.length > 0 &&
      configState.styles.guards.some((guard) => {
        switch (guard.type) {
          case "prop":
            return props?.[guard.name] !== guard.value;
          case "variable":
            return variables.find((variable) => {
              return (
                guard.name in variable && variable[guard.name] !== guard.value
              );
            });
          case "container":
            return containers[guard.name] !== guard.value;
        }
      });

    if (shouldRerenderStyles) {
      styleSet.add(configState);
    }
  }

  const actions: PerformConfigReducerAction[] = [];

  for (const configState of declarationSet) {
    actions.push({
      action: { type: "update-definitions" },
      index: configState.index,
    });
  }

  for (const configState of styleSet) {
    actions.push({
      action: { type: "update-styles" },
      index: configState.index,
    });
  }

  if (actions.length) {
    dispatch(actions);
  }
}

export function initUseInterop(
  dispatch: Dispatch<PerformConfigReducerAction[]>,
  type: ComponentType,
  configStates: ConfigReducerState[],
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): UseInteropState {
  return performConfigReducerActions(
    {
      key: {},
      type,
      configStates,
      dispatch,
      epoch: 0,
    },
    actions,
    incomingProps,
    inheritedVariables,
    inheritedContainers,
  );
}

export function performConfigReducerActions(
  previous: UseInteropState,
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): UseInteropState {
  let configStatesToUpdate: [number, ConfigReducerState][] | undefined;

  /**
   * This reducer's state is used as the props for multiple components/hooks.
   * So we need to preserve the value if it didn't change.
   *
   * For example, setting a new variable shouldn't change the container attribute.
   */
  for (const { index, action } of actions) {
    const configState = previous.configStates[index];
    const nextConfigState = configReducer(
      configState,
      action,
      previous,
      incomingProps,
      inheritedVariables,
      inheritedContainers,
    );

    /**
     * If the config state didn't change, we can skip updating the state.
     */
    if (Object.is(configState, nextConfigState)) {
      continue;
    }

    configStatesToUpdate ??= [];
    configStatesToUpdate.push([index, nextConfigState]);
  }

  // If this was never created, then nothing changed
  if (!configStatesToUpdate) {
    return previous;
  }

  const configStates = [...previous.configStates];
  for (const [index, configState] of configStatesToUpdate) {
    configStates[index] = configState;
  }

  let containers: UseInteropState["containers"];
  let sideEffects: UseInteropState["sideEffects"];
  let sharedValues: UseInteropState["sharedValues"];
  let animations: UseInteropState["animations"];
  let transitions: UseInteropState["transitions"];
  let baseStyles: UseInteropState["baseStyles"];
  let props: UseInteropState["props"];

  const variableDraft = new DraftableArray(previous.variables);

  for (const state of configStates) {
    if (state.variables) {
      variableDraft.push(state.variables);
    }

    if (state.containers) {
      containers ??= {};
      Object.assign(containers, state.containers);
    }

    if (state.declarations?.sideEffects) {
      sideEffects ??= [];
      sideEffects.push(...state.declarations?.sideEffects);
    }

    if (state.styles) {
      props ??= {};
      Object.assign(props, state.styles.props);

      if (state.styles.sideEffects) {
        sideEffects ??= [];
        sideEffects.push(...state.styles?.sideEffects);
      }

      if (state.styles.animationIO) {
        sharedValues ??= [];
        animations ??= [];
        baseStyles ??= {};
        Object.assign(baseStyles, state.styles.baseStyles);
        for (const animation of state.styles.animationIO) {
          sharedValues.push(animation[0]);
          animations.push(animation);
        }
      }
    }

    if (state.declarations?.transition) {
      sharedValues ??= [];
      transitions ??= [];
      if (state.styles?.transitions) {
        for (const transition of state.styles.transitions) {
          sharedValues.push(transition[1]);
          transitions.push(transition);
        }
      }
    }
  }

  const type =
    animations || transitions
      ? animatedComponent(previous.type)
      : previous.type;

  const next: UseInteropState = {
    ...previous,
    variables: variableDraft.commit(),
    type,
    baseStyles,
    props,
    configStates,
    containers,
    animations,
    transitions,
    sharedValues,
    sideEffects,
  };

  return next;
}

export function getUseInteropOptions(options: EnableCssInteropOptions<any>) {
  const configs: ConfigReducerState[] = [];
  const initialActions: PerformConfigReducerAction[] = [];

  Object.entries(options).forEach(([source, config], index) => {
    let target = typeof config === "object" ? config.target : config;

    if (target === true) {
      target = source;
    }

    let nativeStyleToProp: Config["nativeStyleToProp"];

    if (typeof config === "object" && config.nativeStyleToProp) {
      nativeStyleToProp = Object.fromEntries(
        Object.entries(config.nativeStyleToProp).map(([key, value]) => {
          return [key, value === true ? [key] : value.split(".")];
        }),
      );
    }

    configs[index] = {
      index,
      source,
      target,
      nativeStyleToProp,
    };

    initialActions.push({
      action: { type: "update-definitions" },
      index,
    });
  });

  return { configs, initialActions };
}
