import { PropRuntimeValueDescriptor, RuntimeValueDescriptor } from "./types";

export const INTERNAL_RESET = Symbol();
export const INTERNAL_SET = Symbol();
export const INTERNAL_FLAGS = Symbol();

export const DEFAULT_CONTAINER_NAME = "@__";

export const STYLE_SCOPES = {
  STATIC: 0, // Style is completely static
  GLOBAL: 1, // Style is the same globally (media queries)
  CONTEXT: 2, // Style is the same within a context (variables / containers)
  SELF: 3, // Style can affect other styles (sets variable)
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
