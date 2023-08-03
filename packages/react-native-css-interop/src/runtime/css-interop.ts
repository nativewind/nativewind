import { InteropFunction } from "../types";

/**
 * Web doesn't need to any anything, its props are already mapped
 */
export const defaultCSSInterop: InteropFunction = (jsx, type, props, key) => {
  return jsx(type, props, key);
};
