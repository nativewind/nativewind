import { useContext, useDebugValue, useEffect, useReducer } from "react";
import type { ComponentType, Dispatch } from "react";

import { SharedValue } from "react-native-reanimated";

import { SharedValueInterpolation, useAnimation } from "./animations";
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
import type { Config, ConfigStates, SideEffectTrigger } from "./types";
import { cleanupEffect } from "./utils/observable";

export type UseInteropState = Readonly<{
  key: object;
  dispatch: Dispatch<PerformConfigReducerAction[]>;
  // The type this component will render as
  type: ComponentType;
  // The base component type
  baseType: ComponentType;
  // The results of the config reducers grouped by their key
  configStates: Readonly<ConfigStates>;
  // The flattened version of groupedProps
  props?: Record<string, any>;
  // The variables for each config, grouped by config key
  variables?: VariableContextValue;
  // The containers for each config, grouped by config key
  containers?: ContainerContextValue;
  // The hover actions for each config, grouped by config key
  hoverActions?: Record<string, ConfigReducerAction[] | undefined>;
  // The active actions for each config, grouped by config key
  activeActions?: Record<string, ConfigReducerAction[] | undefined>;
  // The focus actions for each config, grouped by config key
  focusActions?: Record<string, ConfigReducerAction[] | undefined>;
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
  key: string;
}>;

export function buildUseInterop(type: ComponentType, ...configs: Config[]) {
  const configStates: ConfigStates = {};
  const initialState = { type, configStates };
  const initialActions: PerformConfigReducerAction[] = [];

  /**
   * Group the configs by index so we can easily reference them later.
   * Build an array of actions to initialize the interopReducer.
   */
  configs.forEach((config, index) => {
    const key = `${index}`;
    const configState = { key, config: { key, ...config } };
    configStates[key] = configState;
    initialActions.push({
      action: { type: "update-definitions" },
      key,
    });
  });

  return function useInterop(props: Record<string, any>) {
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
        /**
         * Generate the initial state for this component by running
         * `update-definitions` for each config
         */
        return initComponentReducer(
          /*
           * You cannot pass dispatch directly to the reducer,
           * but wrapping it in a function will capture its value.
           */
          (actions) => dispatch(actions),
          type,
          initialState,
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

    /**
     * Calculate the interaction and animation props
     * We need to ensure that these do no modify the reducer state
     */
    let nextProps: Record<string, any> | undefined;
    // nextProps = useInteraction(state, nextProps);
    nextProps = useAnimation(state, nextProps);

    return nextProps;
  };
}

function maybeRerenderComponent(
  state: UseInteropState,
  dispatch: Dispatch<PerformConfigReducerAction[]>,
  props: Record<string, unknown>,
  variables: VariableContextValue,
  containers: ContainerContextValue,
) {
  const declarationSet = new Set<ConfigReducerState>();
  const styleSet = new Set<ConfigReducerState>();

  for (const key in state.configStates) {
    const configState = state.configStates[key];

    const shouldRerenderDeclarations = configState.declarations?.guards?.some(
      (guard) => {
        switch (guard.type) {
          case "prop":
            return props[guard.name] !== guard.value;
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
            return props[guard.name] !== guard.value;
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
      key: configState.key,
    });
  }

  for (const configState of styleSet) {
    actions.push({ action: { type: "update-styles" }, key: configState.key });
  }

  if (actions.length) {
    dispatch(actions);
  }
}

export function initComponentReducer(
  dispatch: Dispatch<PerformConfigReducerAction[]>,
  type: ComponentType,
  state: Partial<UseInteropState>,
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): UseInteropState {
  return Object.assign(
    { key: {}, type, baseType: type, dispatch },
    performConfigReducerActions(
      state as UseInteropState,
      actions,
      incomingProps,
      inheritedVariables,
      universalVariables,
      inheritedContainers,
    ),
  );
}

export function performConfigReducerActions(
  state: UseInteropState,
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): UseInteropState {
  let configStatesToUpdate: ConfigStates | undefined;

  /**
   * This reducer's state is used as the props for multiple components/hooks.
   * So we need to preserve the value if it didn't change.
   *
   * For example, setting a new variable shouldn't change the container attribute.
   */
  for (const { key, action } of actions) {
    const configState = state.configStates[key];
    const nextConfigState = configReducer(
      configState,
      action,
      state.dispatch,
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

    configStatesToUpdate ??= {};
    configStatesToUpdate[key] = nextConfigState;
  }

  // If this was never created, then nothing changed
  if (!configStatesToUpdate) {
    return state;
  }

  const configStates = Object.assign(
    {},
    state.configStates,
    configStatesToUpdate,
  );

  let variables: UseInteropState["variables"];
  let containers: UseInteropState["containers"];
  let sideEffects: UseInteropState["sideEffects"];
  let sharedValues: UseInteropState["sharedValues"];
  let animations: UseInteropState["animations"];
  let transitions: UseInteropState["transitions"];
  let baseStyles: UseInteropState["baseStyles"];

  for (const state of Object.values(configStates)) {
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

    if (state.styles?.sideEffects) {
      sideEffects ??= [];
      sideEffects.push(...state.styles?.sideEffects);
    }

    if (state.styles?.animationIO) {
      sharedValues ??= [];
      animations ??= [];
      baseStyles ??= {};
      Object.assign(baseStyles, state.styles.baseStyles);
      for (const animation of state.styles.animationIO) {
        sharedValues.push(animation[0]);
        animations.push(animation);
      }
    }

    if (state.styles?.transitions) {
      sharedValues ??= [];
      transitions ??= [];
      for (const transition of state.styles.transitions) {
        sharedValues.push(transition[1]);
        transitions.push(transition);
      }
    }
  }

  const next: UseInteropState = {
    ...state,
    baseStyles,
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
