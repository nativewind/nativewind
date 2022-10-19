import { createContext } from "react";

export const GroupContext = createContext({
  "group-hover": false,
  "group-focus": false,
  "group-active": false,
});

export const ScopedGroupContext = createContext({
  "scoped-group-hover": false,
  "scoped-group-focus": false,
  "scoped-group-active": false,
});
