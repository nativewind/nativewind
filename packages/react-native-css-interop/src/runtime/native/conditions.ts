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
  PseudoClassesQuery,
  StyleRule,
} from "../../types";
import { colorScheme, isReduceMotionEnabled, rem, vh, vw } from "./globals";
import { Platform } from "react-native";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { Effect, observable } from "../observable";
import type { ComponentState, PropState } from "./native-interop";

interface ConditionReference {
  width: number | { get: (effect?: Effect) => number };
  height: number | { get: (effect?: Effect) => number };
}

export function testRule(
  state: PropState,
  styleRule: StyleRule,
  props: Record<string, any> | null | undefined,
) {
  if (styleRule.pseudoClasses) {
    if (!testPseudoClasses(state, styleRule.pseudoClasses)) {
      return false;
    }
  }

  if (styleRule.media && !testMediaQueries(state, styleRule.media)) {
    return false;
  }

  if (
    styleRule.containerQuery &&
    !testContainerQuery(state, styleRule.containerQuery)
  ) {
    return false;
  }

  if (styleRule.attrs) {
    for (const attrCondition of styleRule.attrs) {
      const attrValue = getTestAttributeValue(props, attrCondition);
      state.tracking.attributes ??= [];
      state.tracking.attributes.push({
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

export function testMediaQueries(state: PropState, mediaQueries: MediaQuery[]) {
  return mediaQueries.every((query) => testMediaQuery(state, query));
}

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(
  state: PropState,
  mediaQuery: MediaQuery,
  conditionReference: ConditionReference = {
    width: vw,
    height: vh,
  },
) {
  const pass = testCondition(state, mediaQuery.condition, conditionReference);
  return mediaQuery.qualifier === "not" ? !pass : pass;
}

export function testPseudoClasses(
  propState: PropState,
  meta: PseudoClassesQuery,
  interaction = propState.interaction,
) {
  /* If any of these conditions fail, it fails failed */
  let passed = true;
  if (meta.active) {
    interaction.active ??= observable(false);
    passed = interaction.active.get(propState.declarationEffect) && passed;
  }
  if (meta.hover) {
    interaction.hover ??= observable(false);
    passed = interaction.hover.get(propState.declarationEffect) && passed;
  }
  if (meta.focus) {
    interaction.focus ??= observable(false);
    passed = interaction.focus.get(propState.declarationEffect) && passed;
  }
  return passed;
}

export function testContainerQuery(
  state: PropState,
  containerQuery: ExtractedContainerQuery[] | undefined,
) {
  // If there is no query, we passed
  if (!containerQuery || containerQuery.length === 0) {
    return true;
  }

  return containerQuery.every((query) => {
    let container: ComponentState | undefined;
    if (query.name) {
      container = state.refs.containers[query.name];
      // If the query has a name, but the container doesn't exist, we failed
      if (!container) return false;
    }

    // If the query has a name, we use the container with that name
    // Otherwise default to the last container
    if (!container) container = state.refs.containers[DEFAULT_CONTAINER_NAME];

    // We failed if the container doesn't exist (e.g no default container)
    if (!container) return false;

    if (
      query.pseudoClasses &&
      !testPseudoClasses(state, query.pseudoClasses, container.interaction)
    ) {
      return false;
    }

    // If there is no condition, we passed (maybe only named as specified)
    if (!query.condition) return true;

    // Containers will always have a layout interaction
    const layout = container.interaction.layout!.get(state.declarationEffect);

    return testCondition(state, query.condition, {
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
  state: PropState,
  condition: ContainerCondition<Declaration> | null | undefined,
  conditionReference: ConditionReference,
): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every((c) => {
        return testCondition(state, c, conditionReference);
      });
    } else {
      return condition.conditions.some((c) => {
        return testCondition(state, c, conditionReference);
      });
    }
  } else if (condition.type === "not") {
    return !testCondition(state, condition.value, conditionReference);
  } else if (condition.type === "style") {
    // TODO
    return false;
  }

  return testFeature(state, condition.value, conditionReference);
}

function testFeature(
  state: PropState,
  feature: QueryFeatureFor_MediaFeatureId,
  conditionReference: ConditionReference,
) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(state, feature, conditionReference);
    case "range":
      return testRange(state, feature, conditionReference);
    case "boolean":
      return testBoolean(state, feature);
    case "interval":
      return false;
    default:
      feature satisfies never;
  }

  return false;
}

function testPlainFeature(
  state: PropState,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "plain" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(state, feature.value);

  if (value === null) {
    return false;
  }

  switch (feature.name) {
    case "display-mode":
      return value === "native" || Platform.OS === value;
    case "prefers-color-scheme":
      return colorScheme.get(state.declarationEffect) === value;
    case "width":
      return testComparison(state, "equal", ref.width, value);
    case "min-width":
      return testComparison(state, "greater-than-equal", ref.width, value);
    case "max-width":
      return testComparison(state, "less-than-equal", ref.width, value);
    case "height":
      return testComparison(state, "equal", ref.height, value);
    case "min-height":
      return testComparison(state, "greater-than-equal", ref.height, value);
    case "max-height":
      return testComparison(state, "less-than-equal", ref.height, value);
    case "orientation":
      return value === "landscape"
        ? testComparison(state, "less-than", ref.height, ref.width)
        : testComparison(state, "greater-than-equal", ref.height, ref.width);
    default:
      return false;
  }
}

function getMediaFeatureValue(state: PropState, value: MediaFeatureValue) {
  if (value.type === "number") {
    return value.value;
  } else if (value.type === "length") {
    if (value.value.type === "value") {
      const length = value.value.value;
      switch (length.unit) {
        case "px":
          return length.value;
        case "rem":
          return length.value * rem.get(state.declarationEffect);
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
  state: PropState,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "range" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(state, feature.value);

  if (value === null || typeof value !== "number") {
    return false;
  }

  switch (feature.name) {
    case "height":
      return testComparison(state, feature.operator, ref.height, value);
    case "width":
      return testComparison(state, feature.operator, ref.width, value);
    default:
      return false;
  }
}

function testComparison(
  state: PropState,
  comparison: MediaFeatureComparison,
  ref: number | { get(effect: Effect): number },
  value: unknown,
) {
  ref = unwrap(state.declarationEffect, ref);
  value = unwrap(state.declarationEffect, value);

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
  state: PropState,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "boolean" }>,
) {
  switch (feature.name) {
    case "prefers-reduced-motion":
      return isReduceMotionEnabled.get(state.declarationEffect);
  }
  return false;
}

function unwrap<T>(effect: Effect, value: T | { get(effect: Effect): T }): T {
  return value && typeof value === "object" && "get" in value
    ? value.get(effect)
    : (value as T);
}

export function testAttributesChanged(
  attrDependencies: AttributeDependency[],
  props?: Record<string, any> | null,
) {
  return attrDependencies.some((condition) => {
    const current =
      condition.type === "data-attribute"
        ? props?.["dataSet"]?.[condition.name]
        : props?.[condition.name];

    return current !== condition.previous;
  });
}

export function getTestAttributeValue(
  props: Record<string, any> | null | undefined,
  condition: AttributeCondition,
) {
  return condition.type === "data-attribute"
    ? props?.["dataSet"]?.[condition.name]
    : props?.[condition.name];
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
