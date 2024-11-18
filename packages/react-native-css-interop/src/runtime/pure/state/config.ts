import type { ContainerContextValue, VariableContextValue } from "../contexts";
import { buildDeclarations, type Declarations } from "../declarations";
import { buildStyles, type Styles } from "../styles";
import type {
  ConfigWithIndex,
  InlineStyle,
  Props,
  StyleValueDescriptor,
} from "../types";
import type { UseInteropState } from "../useInterop";
import { cleanupEffect } from "../utils/observable";

export type ConfigReducerState = ConfigWithIndex &
  Readonly<{
    // The key of the config, used to group props, variables, containers, etc.
    index: number;
    // The declarations that apply to this component
    declarations?: Declarations;
    // The styles from the declarations
    styles?: Styles;
    // The containers produced by the config
    containers?: Record<string, unknown>;
    // The containers produced by the config
    variables?: Record<string, StyleValueDescriptor>;
  }>;

export type ConfigReducerAction = Readonly<
  { type: "update-styles" } | { type: "update-definitions" }
>;

export function configReducer(
  state: ConfigReducerState,
  action: ConfigReducerAction,
  componentState: UseInteropState,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
) {
  switch (action.type) {
    case "update-definitions": {
      let nextState = updateDefinitions(
        state,
        componentState,
        incomingProps,
        inheritedVariables,
      );
      return Object.is(state, nextState)
        ? state
        : updateStyles(
            nextState,
            componentState,
            incomingProps,
            inheritedVariables,
            inheritedContainers,
          );
    }
    case "update-styles": {
      return updateStyles(
        state,
        componentState,
        incomingProps,
        inheritedVariables,
        inheritedContainers,
      );
    }
    default: {
      action satisfies never;
      return state;
    }
  }
}

function updateDefinitions(
  state: ConfigReducerState,
  componentState: UseInteropState,
  props: Props,
  inheritedVariables: VariableContextValue,
): ConfigReducerState {
  const source = props?.[state.source] as string | undefined;

  // TODO
  if (state.target === false) {
    return state;
  }

  const target = props?.[state.target] as InlineStyle | undefined;

  // Has this component ever seen styles?
  const initialized = state.declarations;

  // Is there anything to do?
  if (!initialized && !source && !target) {
    return state;
  }

  const previous = state.declarations;
  let next = buildDeclarations(
    state,
    componentState,
    props,
    inheritedVariables,
  );

  /*
   * If they are the same epoch, then nothing changed.
   * However, we created a new effect that needs to be cleaned up
   */
  if (next.epoch === previous?.epoch) {
    cleanupEffect(next);
    return state;
  }

  // Clean up the previous effect
  cleanupEffect(previous);

  return {
    ...state,
    declarations: next,
  };
}

function updateStyles(
  previous: ConfigReducerState,
  componentState: UseInteropState,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
) {
  /**
   * Currently the styles will always be updated, but in the future we can
   * optimize this to only update when the props have changed.
   */
  const next = buildStyles(
    previous,
    incomingProps,
    inheritedVariables,
    inheritedContainers,
    () => {
      componentState.dispatch([
        { action: { type: "update-styles" }, index: previous.index },
      ]);
    },
  );

  if (next.styles?.epoch === previous?.styles?.epoch) {
    /*
     * If they are the same epoch, then nothing changed.
     * However, we created a new effect that needs to be cleaned up
     */
    cleanupEffect(next.styles);
    return previous;
  }

  cleanupEffect(previous.styles);
  return next;
}
