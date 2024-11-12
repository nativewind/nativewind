import type { ContainerContextValue, VariableContextValue } from "../contexts";
import { buildDeclarations, type Declarations } from "../declarations";
import { buildStyles, type Styles } from "../styles";
import type {
  ConfigWithKey,
  InlineStyle,
  Props,
  StyleValueDescriptor,
} from "../types";
import { UseInteropDispatch } from "../useInterop";
import { cleanupEffect } from "../utils/observable";

export type ConfigReducerState = Readonly<{
  // The key of the config, used to group props, variables, containers, etc.
  key: string;
  // The config that this state is for
  config: ConfigWithKey;
  source?: string | null | undefined;
  target?: Record<string, unknown> | null | undefined;

  declarations?: Declarations;
  styles?: Styles;

  // The variables produced by the config
  variables?: Record<string, StyleValueDescriptor>;
  // The containers produced by the config
  containers?: Record<string, unknown>;
  // The hover actions produced by the config
  hoverActions?: ConfigReducerAction[];
  // The active actions produced by the config
  activeActions?: ConfigReducerAction[];
  // The focus actions produced by the config
  focusActions?: ConfigReducerAction[];
}>;

export type ConfigReducerAction = Readonly<
  { type: "update-styles" } | { type: "update-definitions" }
>;

export function configReducer(
  state: ConfigReducerState,
  action: ConfigReducerAction,
  dispatch: UseInteropDispatch,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
  inheritedContainers: ContainerContextValue,
) {
  switch (action.type) {
    case "update-definitions": {
      let nextState = updateDefinitions(state, dispatch, incomingProps);
      return Object.is(state, nextState)
        ? state
        : updateStyles(
            nextState,
            dispatch,
            incomingProps,
            inheritedVariables,
            universalVariables,
            inheritedContainers,
          );
    }
    case "update-styles": {
      return updateStyles(
        state,
        dispatch,
        incomingProps,
        inheritedVariables,
        universalVariables,
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
  dispatch: UseInteropDispatch,
  props: Props,
): ConfigReducerState {
  const source = props?.[state.config.source] as string | undefined;
  const target = props?.[state.config.target] as InlineStyle | undefined;

  // Has this component ever seen styles?
  const initialized = state.declarations;

  // Is there anything to do?
  if (!initialized && !source && !target) {
    return state;
  }

  const previous = state.declarations;
  let next = buildDeclarations(state, props, () => {
    dispatch([{ action: { type: "update-definitions" }, key: state.key }]);
  });

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
  dispatch: UseInteropDispatch,
  incomingProps: Props,
  inheritedVariables: VariableContextValue,
  universalVariables: VariableContextValue,
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
    universalVariables,
    inheritedContainers,
    () => {
      dispatch([{ action: { type: "update-styles" }, key: previous.key }]);
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
