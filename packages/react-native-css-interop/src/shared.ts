import { PropRuntimeValueDescriptor, RuntimeValueDescriptor } from "./types";

export const INTERNAL_RESET = Symbol();
export const INTERNAL_SET = Symbol();
export const INTERNAL_FLAGS = Symbol();

export const DEFAULT_CONTAINER_NAME = "@__";

export const STYLE_SCOPES = {
  /** @description Style is the same globally */
  GLOBAL: 0,
  /** @description Style is the same within a context (variables / containers) */
  CONTEXT: 1,
  /** @description Style can affect other styles (sets variables, uses other styles) */
  SELF: 2,
};

export function isPropDescriptor(
  value: unknown,
): value is PropRuntimeValueDescriptor {
  return typeof value === "object" && value !== null && "$$type" in value;
}

export function isRuntimeValue(
  value: unknown,
): value is RuntimeValueDescriptor {
  if (!value) {
    return false;
  } else if (Array.isArray(value)) {
    return value.some((v) => isRuntimeValue(v));
  } else if (typeof value === "object") {
    if ((value as Record<string, unknown>).type === "runtime") {
      return true;
    } else {
      return Object.values(value).some((v) => isRuntimeValue(v));
    }
  } else {
    return false;
  }
}
