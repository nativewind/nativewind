import { useContext, useDebugValue, useEffect, useReducer } from "react";
import type { ComponentType, Dispatch } from "react";

import { SharedValue } from "react-native-reanimated";

import { SharedValueInterpolation } from "./animations";
import { createUseInteropElement } from "./components/typeUpgrades";
import type { ContainerContextValue, VariableContextValue } from "./contexts";
import {
  ContainerContext,
  UniversalVariableContext,
  VariableContext,
} from "./contexts";
import {
  configReducer,
  type ConfigReducerAction,
  type ConfigReducerState,
} from "./state/config";
import { Transition } from "./transitions";
import type { Config, Props, SideEffectTrigger } from "./types";
import { cleanupEffect } from "./utils/observable";

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

export function buildUseInterop(type: ComponentType, ...configs: Config[]) {
  const configStates: ConfigReducerState[] = [];
  const initialActions: PerformConfigReducerAction[] = [];

  /**
   * Group the configs by index so we can easily reference them later.
   * Build an array of actions to initialize the interopReducer.
   */
  configs.forEach((config, index) => {
    const configState = {
      index,
      config: { index, ...config },
    };
    configStates[index] = configState;
    initialActions.push({
      action: { type: "update-definitions" },
      index,
    });
  });

  return function useInterop(props: Props) {
    const inheritedVariables = useContext(VariableContext);
    const universalVariables = useContext(UniversalVariableContext);
    const inheritedContainers = useContext(ContainerContext);

    let [state, dispatch] = useReducer(
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
          universalVariables,
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
          universalVariables,
          inheritedContainers,
        );
      },
    );

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

    // Create the new props by merging the incoming props with the props from the state
    // and then removing the source props
    let nextProps: Props = { ...props, ...state.props };
    for (const config of state.configStates) {
      if (config.config.source !== config.config.target) {
        delete nextProps[config.config.source];
      }
    }

    return createUseInteropElement(state, nextProps);
  };
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
            if (variables instanceof Map) {
              return guard.value !== variables.get(guard.name);
            } else {
              return variables[guard.name] !== guard.value;
            }
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
            if (variables instanceof Map) {
              return guard.value !== variables.get(guard.name);
            } else {
              return variables[guard.name] !== guard.value;
            }
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
    universalVariables,
    inheritedContainers,
  );
}

export function performConfigReducerActions(
  previous: UseInteropState,
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
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
      universalVariables,
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

  let variables: UseInteropState["variables"];
  let containers: UseInteropState["containers"];
  let sideEffects: UseInteropState["sideEffects"];
  let sharedValues: UseInteropState["sharedValues"];
  let animations: UseInteropState["animations"];
  let transitions: UseInteropState["transitions"];
  let baseStyles: UseInteropState["baseStyles"];
  let props: UseInteropState["props"];

  for (const state of configStates) {
    if (state.variables) {
      variables ??= {};
      Object.assign(variables, state.variables);
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

  const next: UseInteropState = {
    ...previous,
    baseStyles,
    props,
    configStates,
    variables,
    containers,
    animations,
    transitions,
    sharedValues,
    sideEffects,
  };

  return next;
}
