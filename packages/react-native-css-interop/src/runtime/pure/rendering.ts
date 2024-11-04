import type { ComponentReducerState } from "./state/component";

export function updateRenderTree(
  previousState: ComponentReducerState,
  configStates: ComponentReducerState["configStates"],
  variables: ComponentReducerState["variables"],
  containers: ComponentReducerState["containers"],
  hoverActions: ComponentReducerState["hoverActions"],
  activeActions: ComponentReducerState["activeActions"],
  focusActions: ComponentReducerState["focusActions"],
  animations: ComponentReducerState["animations"],
  sideEffects: ComponentReducerState["sideEffects"],
) {
  let props = {};

  for (const key in configStates) {
    const configState = configStates[key];
    Object.assign(props, configState.styles?.props);
  }

  return {
    ...previousState,
    activeActions,
    animations,
    configStates,
    containers,
    focusActions,
    hoverActions,
    props,
    sideEffects,
    variables,
  };
}
