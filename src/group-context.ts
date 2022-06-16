import { createContext } from "react";

export const GroupContext = createContext({
  groupHover: false,
  groupFocus: false,
  groupActive: false,
});

export const ScopedGroupContext = createContext({
  scopedGroupHover: false,
  scopedGroupFocus: false,
  scopedGroupActive: false,
});
