import type { PropRuntimeValueDescriptor } from "./types";

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

export const transformProperties = new Set([
  "perspective",
  "translateX",
  "translateY",
  "translateZ",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "skewZ",
  "matrix",
  "matrix3d",
]);

export const shadowProperties = new Set([
  "-rn-shadow-offset.width",
  "-rn-shadow-offset.height",
  "-rn-text-shadow-offset.width",
  "-rn-text-shadow-offset.height",
  "shadow-offset.width",
  "shadow-offset.height",
  "text-shadow-offset.width",
  "text-shadow-offset.height",
]);
