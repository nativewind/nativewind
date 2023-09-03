import { InteropFunction } from "../types";

/**
 * Web doesn't need to any anything, its props are already mapped
 */
export const defaultCSSInterop: InteropFunction = (_, jsx, ...args) => {
  return jsx(...args);
};
