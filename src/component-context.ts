import { createContext, useContext } from "react";

export interface ComponentContext {
  componentHover: boolean;
  componentFocus: boolean;
  componentActive: boolean;
}

export const ComponentContext = createContext<ComponentContext>({
  componentHover: false,
  componentFocus: false,
  componentActive: false,
});

export function useComponent() {
  return useContext(ComponentContext);
}
