import type { SharedValue } from "react-native-reanimated";

import { ShorthandSymbol } from "./runtime/native/resolvers/shared";
import type { Placeholder, ShorthandResult } from "./runtime/native/types";
import {
  InteropComponentConfig,
  RuntimeStyle,
  RuntimeValueDescriptor,
  Specificity,
} from "./types";

export const INTERNAL_RESET: unique symbol = Symbol();
export const INTERNAL_SET: unique symbol = Symbol();
export const INTERNAL_FLAGS: unique symbol = Symbol();
export const StyleRuleSetSymbol: unique symbol = Symbol();
export const StyleRuleSymbol: unique symbol = Symbol();

export const PLACEHOLDER_SYMBOL: unique symbol = Symbol();

export const DEFAULT_CONTAINER_NAME = "@__";

export const STYLE_SCOPES = {
  /** @description Style is the same globally */
  GLOBAL: 0,
  /** @description Style is the same within a context (variables / containers) */
  CONTEXT: 1,
  /** @description Style can affect other styles (sets variables, uses other styles) */
  SELF: 2,
};

export function isDescriptorFunction(
  value: RuntimeValueDescriptor | RuntimeValueDescriptor[],
): value is Extract<RuntimeValueDescriptor, [{}, ...any[]]> {
  return (
    Array.isArray(value) &&
    typeof value[0] === "object" &&
    !Array.isArray(value[0])
  );
}

export function isDescriptorArray(
  value: RuntimeValueDescriptor | RuntimeValueDescriptor[],
): value is RuntimeValueDescriptor[] {
  if (Array.isArray(value)) {
    // If its an array and the first item is an object, the only allowed value is an array
    // Otherwise this is a RuntimeDescriptorFunction
    return typeof value[0] === "object" ? Array.isArray(value[0]) : true;
  }

  return false;
}

export function isRuntimeDescriptor(
  value: RuntimeStyle,
): value is RuntimeValueDescriptor {
  if (typeof value === "object" && Array.isArray(value)) {
    return true;
  } else {
    return typeof value !== "object";
  }
}

type ArrayMergeStyles = "push";
type ObjectMergeStyles = "assign" | "toArray";

export function assignToTarget(
  parent: Record<string, any>,
  value:
    | Record<string, unknown>
    | RuntimeValueDescriptor
    | SharedValue<any>
    | ShorthandResult
    | Placeholder,
  config: InteropComponentConfig | string[],
  options: {
    arrayMergeStyle?: ArrayMergeStyles;
    objectMergeStyle?: ObjectMergeStyles;
    allowTransformMerging?: boolean;
    reverseTransformPush?: boolean;
  } = {},
) {
  /**
   * Handle shorthands first
   */
  if (typeof value === "object" && ShorthandSymbol in value) {
    return value.map((shorthandConfig) => {
      let pathTokens = Array.from(
        Array.isArray(config) ? config : config.target,
      );

      const shortHandProp = shorthandConfig[0];
      if (typeof shortHandProp === "string") {
        pathTokens.splice(-1, 1, shortHandProp);
      } else {
        pathTokens.splice(-1, 1, ...shortHandProp);
      }

      assignToTarget(parent, shorthandConfig[1], pathTokens, options);
    });
  }

  const {
    arrayMergeStyle = "push",
    objectMergeStyle = "assign",
    allowTransformMerging = false,
    reverseTransformPush = false,
  } = options;

  let prop: string | number;

  let props = Array.isArray(config) ? config : config.target;

  if (props.length === 0) {
    Object.assign(parent, value);
    return;
  }

  for (let index = 0; index < props.length - 1; index++) {
    prop = props[index];

    if (Array.isArray(parent) && isFinite(Number(prop))) {
      prop = Number(prop);
    }

    if (typeof parent[prop] !== "object") {
      parent[prop] = {};
    } else if (Object.isFrozen(parent[prop])) {
      parent[prop] = Object.assign({}, parent[prop]);
    }

    parent = parent[prop];
  }

  // Now use the last value
  prop = props[props.length - 1];

  if (allowTransformMerging && transformKeys.has(prop)) {
    let existing;
    if (!Array.isArray(parent.transform)) {
      parent.transform = [];
    } else {
      existing = parent.transform.find((t: object) => prop in t);
    }

    if (existing) {
      existing[prop] = value;
    } else {
      if (reverseTransformPush) {
        parent.transform.shift({ [prop]: value });
      } else {
        parent.transform.push({ [prop]: value });
      }
    }
  } else {
    const target = parent[prop];

    if (Array.isArray(target)) {
      switch (arrayMergeStyle) {
        case "push":
          target.push(value);
      }
    } else if (
      typeof target === "object" &&
      target &&
      !(PLACEHOLDER_SYMBOL in target)
    ) {
      switch (objectMergeStyle) {
        case "assign": {
          if (typeof value === "object") {
            parent[prop] = Object.assign({}, parent[prop], value);
          } else {
            parent[prop] = value;
          }
          break;
        }
        case "toArray": {
          parent[prop] = [target, value];
        }
      }
    } else if (
      value &&
      typeof value === "object" &&
      !("_isReanimatedSharedValue" in value) &&
      !(PLACEHOLDER_SYMBOL in value) &&
      !Array.isArray(value)
    ) {
      parent[prop] = Object.assign({}, value);
    } else {
      parent[prop] = value;
    }
  }
}

export function getTargetValue(
  parent: Record<string, any>,
  props: string | string[],
) {
  let prop: string | number;

  props = typeof props === "string" ? [props] : props;

  for (let index = 0; index < props.length - 1; index++) {
    prop = props[index];

    if (Array.isArray(parent) && isFinite(Number(prop))) {
      prop = Number(prop);
    }

    if (typeof parent[prop] !== "object") {
      parent[prop] = {};
    }

    parent = parent[prop];
  }

  // Now use the last value
  prop = props[props.length - 1];

  if (transformKeys.has(prop)) {
    let existing;
    if (!Array.isArray(parent.transform)) {
      parent.transform = [];
    } else {
      existing = parent.transform.find((t: object) => prop in t);
    }

    return existing?.[prop];
  } else {
    return parent[prop];
  }
}

export const SpecificityIndex = {
  Order: 0,
  ClassName: 1,
  Important: 2,
  Inline: 3,
  PseudoElements: 4,
  // Id: 0, - We don't support ID yet
  // StyleSheet: 0, - WE don't support multiple stylesheets
};

export const inlineSpecificity: Specificity = [];
inlineSpecificity[SpecificityIndex.Inline] = 1;

export const transformKeys = new Set([
  "translateX",
  "translateY",
  "scale",
  "scaleX",
  "scaleY",
  "rotate",
  "rotateX",
  "rotateY",
  "rotateZ",
  "skewX",
  "skewY",
  "perspective",
  "matrix",
  "transformOrigin",
]);
