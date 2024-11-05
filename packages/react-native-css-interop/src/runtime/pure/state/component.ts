import type { ComponentType, Dispatch, Reducer } from "react";

import type {
  ReanimatedMutable,
  SharedValueInterpolation,
} from "../animations";
import type { ContainerContextValue, VariableContextValue } from "../contexts";
import { updateRenderTree } from "../rendering";
import type { ConfigStates, Maybe, SideEffectTrigger } from "../types";
import type { ConfigReducerAction, ConfigReducerState } from "./config";
import { configReducer } from "./config";

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
  let updatedStates: Maybe<ConfigStates>;
  let nextVariables: Maybe<VariableContextValue>;
  let nextContainers: Maybe<ContainerContextValue>;
  let nextGroupedProps: Maybe<Record<string, Maybe<Record<string, unknown>>>>;
  let nextHoverActions: Maybe<Record<string, Maybe<ConfigReducerAction[]>>>;
  let nextActiveActions: Maybe<Record<string, Maybe<ConfigReducerAction[]>>>;
  let nextFocusActions: Maybe<Record<string, Maybe<ConfigReducerAction[]>>>;
  let nextSideEffects: Maybe<Record<string, Maybe<SideEffectTrigger[]>>>;
  let nextAnimationIO: Maybe<Record<string, Maybe<SharedValueInterpolation[]>>>;
  let nextTransitions: Maybe<
    Record<
      string,
      Map<string | string[], ReanimatedMutable<any> | undefined> | undefined
    >
  >;

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
     *
     * However, variables, containers, and side-effects are special cases where the order matters.
     * If a prior config state set new values, we need to maintain the order by still applying the later ones
     */
    if (Object.is(configState, nextConfigState)) {
      if (nextVariables) Object.assign(nextVariables, configState.variables);
      if (nextContainers) Object.assign(nextContainers, configState.containers);
      continue;
    }

    // Something caused the config state to change, find out what it was

    // Update the state with the new config state
    updatedStates ??= {};
    updatedStates[nextConfigState.key] = nextConfigState;

    // Did the props change?
    if (!Object.is(configState.styles?.props, nextConfigState.styles?.props)) {
      nextGroupedProps ??= {};
      nextGroupedProps[nextConfigState.key] = nextConfigState.styles?.props;
    }

    // Did a variable change?
    if (!Object.is(configState.variables, nextConfigState.variables)) {
      nextVariables ??= {};
      Object.assign(nextVariables, nextConfigState.variables);
    }

    // Did a container change?
    if (!Object.is(configState.containers, nextConfigState.containers)) {
      nextContainers ??= { ...inheritedContainers };
      Object.assign(nextContainers, nextConfigState.containers);
    }

    // Did declaration side effects change?
    if (
      !Object.is(
        configState.declarations?.sideEffects,
        nextConfigState.declarations?.sideEffects,
      )
    ) {
      nextSideEffects ??= {};
      nextSideEffects[`$d:${nextConfigState.key}`] =
        nextConfigState.declarations?.sideEffects;
    }

    // Did style side effects change?
    if (
      !Object.is(
        configState.styles?.sideEffects,
        nextConfigState.styles?.sideEffects,
      )
    ) {
      nextSideEffects ??= {};
      nextSideEffects[`$s:${nextConfigState.key}`] =
        nextConfigState.styles?.sideEffects;
    }

    // Did animations change?
    if (
      !Object.is(
        configState.styles?.animationIO,
        nextConfigState.styles?.animationIO,
      )
    ) {
      nextAnimationIO ??= {};
      nextAnimationIO[nextConfigState.key] =
        nextConfigState.styles?.animationIO;
    }

    // Did transitions change?
    if (
      !Object.is(
        configState.styles?.transitions,
        nextConfigState.styles?.transitions,
      )
    ) {
      nextTransitions ??= {};
      nextTransitions[nextConfigState.key] =
        nextConfigState.styles?.transitions;
    }

    // Did hover actions change?
    if (!Object.is(configState.hoverActions, nextConfigState.hoverActions)) {
      nextHoverActions ??= {};
      nextHoverActions[nextConfigState.key] = nextHoverActions.hoverActions;
    }

    // Did active actions change?
    if (!Object.is(configState.activeActions, nextConfigState.activeActions)) {
      nextActiveActions ??= {};
      nextActiveActions[nextConfigState.key] = nextActiveActions.activeActions;
    }

    // Did focus actions change?
    if (!Object.is(configState.focusActions, nextConfigState.focusActions)) {
      nextFocusActions ??= {};
      nextFocusActions[nextConfigState.key] = nextFocusActions.focusActions;
    }
  }

  // Did anything change?
  if (!updatedStates) {
    return state;
  }

  const sideEffects = nextSideEffects
    ? { ...nextSideEffects }
    : state.sideEffects;

  // Update the render tree, this will inject the context providers / animated types
  return updateRenderTree(
    state,
    Object.assign({}, state.configStates, updatedStates),
    nextVariables ?? state.variables,
    nextContainers ?? state.containers,
    nextHoverActions ?? state.hoverActions,
    nextActiveActions ?? state.activeActions,
    nextFocusActions ?? state.focusActions,
    nextAnimationIO ?? state.animations,
    nextTransitions ?? state.transitions,
    sideEffects,
  );
}
