import { createContext, useContext } from "react";

export interface ComponentContext {
  hover: boolean;
  focus: boolean;
  active: boolean;
}

export const ComponentContext = createContext<ComponentContext>({
  hover: false,
  focus: false,
  active: false,
});

export function useComponent() {
  return useContext(ComponentContext);
}
