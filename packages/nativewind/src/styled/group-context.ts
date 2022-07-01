import { createContext } from "react";

export const GroupContext = createContext({
  groupHover: false,
  groupFocus: false,
  groupActive: false,
});

export const IsolateGroupContext = createContext({
  isolateGroupHover: false,
  isolateGroupFocus: false,
  isolateGroupActive: false,
});
