import type { ComponentType, Dispatch, Reducer } from "react";

import type {
  ReanimatedMutable,
  SharedValueInterpolation,
} from "../animations";
import type { ContainerContextValue, VariableContextValue } from "../contexts";
import type { ConfigStates, SideEffectTrigger } from "../types";
import type { ConfigReducerAction, ConfigReducerState } from "./config";
import { configReducer } from "./config";

export type AnimatableProps = {};

export type ComponentReducerState = Readonly<{
  key: object;
  dispatch: Dispatch<ComponentReducerAction>;
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
  // These are mostly used to control animations
  sideEffects?: Record<string, SideEffectTrigger[] | undefined>;

  // A flattened version of animations / transitions
  sharedValues?: ReanimatedMutable<any>[];

  // Animations
  animations?: Record<string, SharedValueInterpolation[] | undefined>;
  // Transitions
  transitions?: Record<
    string,
    Map<string | string[], ReanimatedMutable<any> | undefined> | undefined
  >;
}>;

export type ComponentReducerAction =
  Readonly<// Perform actions on the configReducer
  {
    type: "perform-config-reducer-actions";
    actions: PerformConfigReducerAction[];
  }>;

export type PerformConfigReducerAction = Readonly<{
  action: ConfigReducerAction;
  key: string;
}>;

export type PerformConfigReducerAction_old = Readonly<{
  action: ConfigReducerAction;
  state: ConfigReducerState;
}>;

export type ComponentReducer = Reducer<
  ComponentReducerState,
  ComponentReducerAction
>;

export function buildComponentReducer(
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): ComponentReducer {
  return (state, action) => {
    switch (action.type) {
      case "perform-config-reducer-actions": {
        return performConfigReducerActions(
          state,
          action.actions,
          incomingProps,
          inheritedVariables,
          universalVariables,
          inheritedContainers,
        );
      }
    }
  };
}

export function initComponentReducer(
  dispatch: Dispatch<ComponentReducerAction>,
  type: ComponentType,
  state: Partial<ComponentReducerState>,
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): ComponentReducerState {
  return Object.assign(
    { key: {}, type, baseType: type, dispatch },
    performConfigReducerActions(
      state as ComponentReducerState,
      actions,
      incomingProps,
      inheritedVariables,
      universalVariables,
      inheritedContainers,
    ),
  );
}

export function performConfigReducerActions(
  state: ComponentReducerState,
  actions: Readonly<PerformConfigReducerAction[]>,
  incomingProps: Record<string, unknown>,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
): ComponentReducerState {
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

  if (!configStatesToUpdate) {
    return state;
  }

  let variables: VariableContextValue | undefined;
  let containers: ContainerContextValue | undefined;
  let sideEffects: SideEffectTrigger[] | undefined;
  const configStates = Object.assign(
    {},
    state.configStates,
    configStatesToUpdate,
  );

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
  }

  const next = {
    ...state,
    configStates,
    variables,
    containers,
  };

  next.variables = Object.assign({}, state.variables);

  return next;
  // // Did anything change?
  // if (!updatedStates) {
  //   return state;
  // }

  // const sideEffects = nextSideEffects
  //   ? { ...nextSideEffects }
  //   : state.sideEffects;

  // // Update the render tree, this will inject the context providers / animated types
  // return updateRenderTree(
  //   state,
  //   Object.assign({}, state.configStates, updatedStates),
  //   nextVariables ?? state.variables,
  //   nextContainers ?? state.containers,
  //   nextHoverActions ?? state.hoverActions,
  //   nextActiveActions ?? state.activeActions,
  //   nextFocusActions ?? state.focusActions,
  //   nextAnimationIO ?? state.animations,
  //   nextTransitions ?? state.transitions,
  //   sideEffects,
  // );
}
