import { useContext, useDebugValue, useEffect, useReducer } from "react";
import type { ComponentType, Dispatch } from "react";

import { useAnimation } from "./animations";
import type { ContainerContextValue, VariableContextValue } from "./contexts";
import {
  ContainerContext,
  UniversalVariableContext,
  VariableContext,
} from "./contexts";
import {
  buildComponentReducer,
  initComponentReducer,
  type ComponentReducerAction,
  type ComponentReducerState,
  type PerformConfigReducerAction,
} from "./state/component";
import type { ConfigReducerState } from "./state/config";
import type { Config, ConfigStates } from "./types";
import { useInteraction } from "./useInteraction";
import { cleanupEffect } from "./utils/observable";

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
      buildComponentReducer(
        props,
        inheritedVariables,
        universalVariables,
        inheritedContainers,
      ),
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
          (action: ComponentReducerAction) => dispatch(action),
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

    /**
     * When props, variables, or containers change, we need to check if any of
     * the configs need to be rerendered.
     *
     * If something has changed, dispatch() will fire cancelling the current
     * render and starting a new one with the updated state.
     */
    dispatchRerenderActions(
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
    nextProps = useInteraction(state, nextProps);
    nextProps = useAnimation(state, nextProps);

    return nextProps;
  };
}

function dispatchRerenderActions(
  state: ComponentReducerState,
  dispatch: Dispatch<ComponentReducerAction>,
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

    const shouldRerenderStyles = configState.styles?.guards?.some((guard) => {
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
    dispatch({ type: "perform-config-reducer-actions", actions });
  }
}
