import type { ContainerContextRecord } from "../contexts";
import type {
  RuntimeFunction,
  StyleValueDescriptor,
  StyleValueResolver,
} from "../types";
import { resolveRuntimeFunction } from "./functions";

export type ResolveOptions = {
  getProp: (name: string) => StyleValueDescriptor;
  getVariable: (name: string) => StyleValueDescriptor;
  getContainer: (name: string) => ContainerContextRecord | undefined;
  castToArray?: boolean;
};

export const resolveValue: StyleValueResolver = (state, value, options) => {
  switch (typeof value) {
    case "bigint":
    case "symbol":
    case "undefined":
      // These types are not supported
      return;
    case "number":
    case "boolean":
      return value;
    case "string":
      return value.endsWith("px") // Inline vars() might set a value with a px suffix
        ? parseInt(value.slice(0, -2), 10)
        : value;
    case "function":
      return resolveValue(state, value(), options);
    case "object": {
      if (!Array.isArray(value)) {
        return value;
      }

      if (isDescriptorArray(value)) {
        value = value.flatMap((d) => {
          const value = resolveValue(state, d, options);
          return value === undefined ? [] : value;
        }) as StyleValueDescriptor[];

        if (options.castToArray && !Array.isArray(value)) {
          return [value];
        } else {
          return value;
        }
      }

      value = resolveRuntimeFunction(
        resolveValue,
        state,
        value as RuntimeFunction,
        options,
      );

      return options.castToArray && value && !Array.isArray(value)
        ? [value]
        : value;
    }
  }
};

function isDescriptorArray(
  value: StyleValueDescriptor | StyleValueDescriptor[],
): value is StyleValueDescriptor[] {
  if (Array.isArray(value)) {
    /**
     * RuntimeFunction's always have an object at index 0.
     * We purposefully don't allow StyleValueDescriptor with an object at index 0
     * because it would be ambiguous with RuntimeFunction
     */
    return typeof value[0] === "object" ? Array.isArray(value[0]) : true;
  }

  return false;
}
