import type {
  ContainerCondition,
  Declaration,
  MediaFeatureComparison,
  MediaFeatureValue,
  MediaQuery,
  QueryFeatureFor_MediaFeatureId,
} from "lightningcss";

import {
  AttributeCondition,
  AttributeDependency,
  ExtractedContainerQuery,
  PropState,
  PseudoClassesQuery,
  StyleRule,
} from "../../types";
import { colorScheme, isReduceMotionEnabled, rem, vh, vw } from "./globals";
import { Platform } from "react-native";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { Effect } from "../observable";
import { InheritedParentContext } from "./inherited-context";

interface ConditionReference {
  width: number | { get: (effect?: Effect) => number };
  height: number | { get: (effect?: Effect) => number };
}

export function testRule(
  state: PropState,
  context: InheritedParentContext,
  declaration: StyleRule,
  props: Record<string, any>,
) {
  if (declaration.pseudoClasses) {
    if (!testPseudoClasses(state, context, declaration.pseudoClasses)) {
      return false;
    }
  }

  if (declaration.media && !testMediaQueries(state, declaration.media)) {
    return false;
  }

  if (
    declaration.containerQuery &&
    !testContainerQuery(state, context, declaration.containerQuery)
  ) {
    return false;
  }

  if (declaration.attrs) {
    for (const attrCondition of declaration.attrs) {
      const attrValue = getTestAttributeValue(props, attrCondition);
      state.attributes.push({
        ...attrCondition,
        previous: attrValue,
      });

      if (!testAttribute(attrValue, attrCondition)) {
        return false;
      }
    }
  }

  return true;
}

export function testMediaQueries(effect: Effect, mediaQueries: MediaQuery[]) {
  return mediaQueries.every((query) => testMediaQuery(effect, query));
}

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(
  effect: Effect,
  mediaQuery: MediaQuery,
  conditionReference: ConditionReference = {
    width: vw,
    height: vh,
  },
) {
  const pass = testCondition(effect, mediaQuery.condition, conditionReference);
  return mediaQuery.qualifier === "not" ? !pass : pass;
}

export function testPseudoClasses(
  effect: Effect,
  context: InheritedParentContext,
  meta: PseudoClassesQuery,
) {
  /* If any of these conditions fail, it fails failed */
  let passed = true;
  if (meta.active) passed = context.getActive(effect) && passed;
  if (meta.hover) passed = context.getHover(effect) && passed;
  if (meta.focus) passed = context.getFocus(effect) && passed;
  return passed;
}

export function testContainerQuery(
  effect: Effect,
  state: InheritedParentContext,
  containerQuery: ExtractedContainerQuery[] | undefined,
) {
  // If there is no query, we passed
  if (!containerQuery || containerQuery.length === 0) {
    return true;
  }

  return containerQuery.every((query) => {
    let container = query.name ? state.getContainer(query.name, effect) : null;
    // If the query has a name, but the container doesn't exist, we failed
    if (query.name && !container) return false;

    // If the query has a name, we use the container with that name
    // Otherwise default to the last container
    if (!container)
      container = state.getContainer(DEFAULT_CONTAINER_NAME, effect);

    // We failed if the container doesn't exist (e.g no default container)
    if (!container) return false;

    const context = container.get(effect)!;

    if (
      query.pseudoClasses &&
      !testPseudoClasses(effect, context, query.pseudoClasses)
    ) {
      return false;
    }

    // If there is no condition, we passed (maybe only named as specified)
    if (!query.condition) return true;

    const layout = context.getLayout(effect) || [0, 0];

    return testCondition(effect, query.condition, {
      width: layout[0],
      height: layout[1],
    });
  });
}

/**
 * Test a media condition against current conditions
 * This is also used for container queries
 */
export function testCondition(
  effect: Effect,
  condition: ContainerCondition<Declaration> | null | undefined,
  conditionReference: ConditionReference,
): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every((c) => {
        return testCondition(effect, c, conditionReference);
      });
    } else {
      return condition.conditions.some((c) => {
        return testCondition(effect, c, conditionReference);
      });
    }
  } else if (condition.type === "not") {
    return !testCondition(effect, condition.value, conditionReference);
  } else if (condition.type === "style") {
    // TODO
    return false;
  }

  return testFeature(effect, condition.value, conditionReference);
}

function testFeature(
  effect: Effect,
  feature: QueryFeatureFor_MediaFeatureId,
  conditionReference: ConditionReference,
) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(effect, feature, conditionReference);
    case "range":
      return testRange(effect, feature, conditionReference);
    case "boolean":
      return testBoolean(effect, feature);
    case "interval":
      return false;
    default:
      feature satisfies never;
  }

  return false;
}

function testPlainFeature(
  effect: Effect,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "plain" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(effect, feature.value);

  if (value === null) {
    return false;
  }

  switch (feature.name) {
    case "display-mode":
      return value === "native" || Platform.OS === value;
    case "prefers-color-scheme":
      return colorScheme.get(effect) === value;
    case "width":
      return testComparison(effect, "equal", ref.width, value);
    case "min-width":
      return testComparison(effect, "greater-than-equal", ref.width, value);
    case "max-width":
      return testComparison(effect, "less-than-equal", ref.width, value);
    case "height":
      return testComparison(effect, "equal", ref.height, value);
    case "min-height":
      return testComparison(effect, "greater-than-equal", ref.height, value);
    case "max-height":
      return testComparison(effect, "less-than-equal", ref.height, value);
    case "orientation":
      return value === "landscape"
        ? testComparison(effect, "less-than", ref.height, ref.width)
        : testComparison(effect, "greater-than-equal", ref.height, ref.width);
    default:
      return false;
  }
}

function getMediaFeatureValue(effect: Effect, value: MediaFeatureValue) {
  if (value.type === "number") {
    return value.value;
  } else if (value.type === "length") {
    if (value.value.type === "value") {
      const length = value.value.value;
      switch (length.unit) {
        case "px":
          return length.value;
        case "rem":
          return length.value * rem.get(effect);
        default:
          return null;
      }
    } else {
      return null;
    }
  } else if (value.type === "ident") {
    return value.value;
  }

  return null;
}

function testRange(
  effect: Effect,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "range" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(effect, feature.value);

  if (value === null || typeof value !== "number") {
    return false;
  }

  switch (feature.name) {
    case "height":
      return testComparison(effect, feature.operator, ref.height, value);
    case "width":
      return testComparison(effect, feature.operator, ref.width, value);
    default:
      return false;
  }
}

function testComparison(
  effect: Effect,
  comparison: MediaFeatureComparison,
  ref: number | { get(effect: Effect): number },
  value: unknown,
) {
  ref = unwrap(effect, ref);
  value = unwrap(effect, value);

  if (typeof value !== "number") return false;
  switch (comparison) {
    case "equal":
      return ref === value;
    case "greater-than":
      return ref > value;
    case "greater-than-equal":
      return ref >= value;
    case "less-than":
      return ref < value;
    case "less-than-equal":
      return ref < value;
  }
}

function testBoolean(
  effect: Effect,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "boolean" }>,
) {
  switch (feature.name) {
    case "prefers-reduced-motion":
      return isReduceMotionEnabled.get(effect);
  }
  return false;
}

function unwrap<T>(effect: Effect, value: T | { get(effect: Effect): T }): T {
  return value && typeof value === "object" && "get" in value
    ? value.get(effect)
    : value;
}

export function testAttributesChanged(
  props: Record<string, any>,
  attrDependencies: AttributeDependency[],
) {
  return attrDependencies.some((condition) => {
    const current =
      condition.type === "data-attribute"
        ? props["dataSet"]?.[condition.name]
        : props[condition.name];

    return current !== condition.previous;
  });
}

export function getTestAttributeValue(
  props: Record<string, any>,
  condition: AttributeCondition,
) {
  return condition.type === "data-attribute"
    ? props["dataSet"]?.[condition.name]
    : props[condition.name];
}

export function testAttribute(propValue: any, condition: AttributeCondition) {
  const operation = condition.operation;

  if (operation == null) return propValue != null;

  switch (operation.operator) {
    case "empty": {
      return propValue == null || propValue == "";
    }
    case "includes":
    case "dash-match":
    case "prefix":
    case "substring":
    case "suffix":
      return false;
    case "equal": {
      return propValue?.toString() === operation.value.toString();
    }
  }
}
