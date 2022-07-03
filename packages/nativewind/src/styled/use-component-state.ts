import { useReducer } from "react";

export interface ComponentState {
  hover: boolean;
  active: boolean;
  focus: boolean;
}

const initialState = { hover: false, active: false, focus: false };

export type Action =
  | { type: "hover"; value: boolean }
  | { type: "active"; value: boolean }
  | { type: "focus"; value: boolean };

function reducer(state: ComponentState, action: Action) {
  switch (action.type) {
    case "hover":
      return { ...state, hover: action.value };
    case "active":
      return { ...state, active: action.value };
    case "focus":
      return { ...state, focus: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export const useComponentState = () => useReducer(reducer, initialState);
