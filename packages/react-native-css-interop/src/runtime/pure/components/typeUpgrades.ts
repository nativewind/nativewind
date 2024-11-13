import { createElement } from "react";

import { VariableContext } from "test";

import {
  createAnimatedComponent,
  createAnimatedElement,
} from "../animations/rendering";
import { ContainerContext } from "../contexts";
import { Props } from "../types";
import { useInteraction } from "../useInteraction";
import { UseInteropState } from "../useInterop";

export function createUseInteropElement(state: UseInteropState, props: Props) {
  let type = state.type;

  const isInteractive =
    state.hoverActions || state.activeActions || state.focusActions;

  props = useInteraction(state, props);

  const isAnimated =
    state.animations || state.transitions || state.sharedValues;

  if (state.animations || state.transitions || state.sharedValues) {
    type = createAnimatedComponent(type);
  }

  if (state.variables) {
    props = { value: state.variables, children: createElement(type, props) };
    type = VariableContext.Provider;
  }

  if (state.containers) {
    props = { value: state.containers, children: createElement(type, props) };
    type = ContainerContext.Provider;
  }

  return isAnimated
    ? createAnimatedElement(state, type, props)
    : createElement(type, props);
}
