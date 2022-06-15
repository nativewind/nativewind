import { createContext } from "react";

export const ScopedGroupContext = createContext({
  scopedGroupHover: false,
  scopedGroupFocus: false,
  scopedGroupActive: false,
});
