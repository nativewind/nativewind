import { useReducer } from "react";

export interface ComponentState {
  hover: boolean;
  active: boolean;
  focus: boolean;
}

const initialState: ComponentState = {
  hover: false,
  active: false,
  focus: false,
};

export type Action = { type: keyof ComputedKeyframe; value: boolean };

function reducer(state: ComponentState, action: Action) {
  switch (action.type) {
    case "hover":
    case "active":
    case "focus":
      return { ...state, [action.type]: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export const useComponentState = () => useReducer(reducer, initialState);
