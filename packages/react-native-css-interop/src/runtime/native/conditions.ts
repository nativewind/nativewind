import type {
  ContainerCondition,
  Declaration,
  MediaFeatureComparison,
  MediaFeatureValue,
  MediaQuery,
  QueryFeatureFor_MediaFeatureId,
} from "lightningcss";
import { I18nManager, Platform } from "react-native";

import {
  AttributeCondition,
  ExtractedContainerQuery,
  PseudoClassesQuery,
  StyleRule,
} from "../../types";
import { colorScheme, isReduceMotionEnabled, rem, vh, vw } from "./globals";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { Effect, observable } from "../observable";
import { ReducerTracking, Refs, RenderingGuard, SharedState } from "./types";

interface ConditionReference {
  width: number | { get: (effect?: Effect) => number };
  height: number | { get: (effect?: Effect) => number };
}

/**
 * Tests a rule against current component's state
 * @param state
 * @param rule
 * @param props
 * @returns
 */
export function testRule(
  rule: StyleRule,
  refs: Refs,
  tracking: ReducerTracking,
) {
  // Does the rule pass all the pseudo classes, media queries, and container queries?
  if (
    rule.pseudoClasses &&
    !testPseudoClasses(refs.sharedState, tracking, rule.pseudoClasses)
  ) {
    return false;
  }
  if (rule.media && !testMediaQueries(refs.sharedState, tracking, rule.media)) {
    return false;
  }
  if (
    rule.containerQuery &&
    !testContainerQuery(refs, tracking, rule.containerQuery)
  ) {
    return false;
  }
  if (rule.attrs && !testAttributes(refs, tracking, rule.attrs)) {
    return false;
  }

  return true;
}

export function testMediaQueries(
  state: SharedState,
  tracking: ReducerTracking,
  mediaQueries: MediaQuery[],
) {
  return mediaQueries.every((query) => testMediaQuery(tracking, query));
}

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(
  tracking: ReducerTracking,
  mediaQuery: MediaQuery,
  conditionReference: ConditionReference = {
    width: vw,
    height: vh,
  },
) {
  const pass =
    mediaQuery.mediaType !== "print" &&
    testCondition(tracking, mediaQuery.condition, conditionReference);
  return mediaQuery.qualifier === "not" ? !pass : pass;
}

export function testPseudoClasses(
  state: SharedState,
  tracking: ReducerTracking,
  meta: PseudoClassesQuery,
) {
  /* If any of these conditions fail, it fails failed */
  let passing = true;
  if (meta.hover && passing) {
    state.hover ??= observable(false);
    passing = state.hover.get(tracking.effect);
  }
  if (meta.active && passing) {
    state.active ??= observable(false);
    passing = state.active.get(tracking.effect);
  }
  if (meta.focus && passing) {
    state.focus ??= observable(false);
    passing = state.focus.get(tracking.effect);
  }
  return passing;
}

export function testContainerQuery(
  refs: Refs,
  tracking: ReducerTracking,
  containerQuery: ExtractedContainerQuery[] | undefined,
) {
  // If there is no query, we passed
  if (!containerQuery || containerQuery.length === 0) {
    return true;
  }

  return containerQuery.every((query) => {
    const guard: RenderingGuard = (refs) => {
      let container;
      if (query.name) {
        container = refs.containers[query.name];
        // If the query has a name, but the container doesn't exist, we failed
        if (!container) return false;
      }

      // If the query has a name, we use the container with that name
      // Otherwise default to the last container
      if (!container) container = refs.containers[DEFAULT_CONTAINER_NAME];

      // We failed if the container doesn't exist (e.g no default container)
      if (!container) return false;

      if (
        query.pseudoClasses &&
        !testPseudoClasses(container, tracking, query.pseudoClasses)
      ) {
        return false;
      }

      if (query.attrs && !testAttributes(refs, tracking, query.attrs)) {
        return false;
      }

      // If there is no condition, we passed (maybe only named as specified)
      if (!query.condition) return true;

      // Containers will always have a layout interaction
      const layout = container.layout?.get(tracking.effect);
      if (!layout) return false;

      return testCondition(tracking, query.condition, {
        width: layout[0],
        height: layout[1],
      });
    };

    tracking.guards.push(guard);

    return guard(refs);
  });
}

/**
 * Test a media condition against current conditions
 * This is also used for container queries
 */
export function testCondition(
  tracking: ReducerTracking,
  condition: ContainerCondition<Declaration> | null | undefined,
  conditionReference: ConditionReference,
): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every((c) => {
        return testCondition(tracking, c, conditionReference);
      });
    } else {
      return condition.conditions.some((c) => {
        return testCondition(tracking, c, conditionReference);
      });
    }
  } else if (condition.type === "not") {
    return !testCondition(tracking, condition.value, conditionReference);
  } else if (condition.type === "style") {
    // TODO
    return false;
  }

  return testFeature(tracking, condition.value, conditionReference);
}

function testFeature(
  tracking: ReducerTracking,
  feature: QueryFeatureFor_MediaFeatureId,
  conditionReference: ConditionReference,
) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(tracking, feature, conditionReference);
    case "range":
      return testRange(tracking, feature, conditionReference);
    case "boolean":
      return testBoolean(tracking, feature);
    case "interval":
      return false;
    default:
      feature satisfies never;
  }

  return false;
}

function testPlainFeature(
  tracking: ReducerTracking,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "plain" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(tracking, feature.value);

  if (value === null) {
    return false;
  }

  switch (feature.name) {
    case "display-mode":
      return value === "native" || Platform.OS === value;
    case "prefers-color-scheme":
      return colorScheme.get(tracking.effect) === value;
    case "width":
      return testComparison(tracking, "equal", ref.width, value);
    case "min-width":
      return testComparison(tracking, "greater-than-equal", ref.width, value);
    case "max-width":
      return testComparison(tracking, "less-than-equal", ref.width, value);
    case "height":
      return testComparison(tracking, "equal", ref.height, value);
    case "min-height":
      return testComparison(tracking, "greater-than-equal", ref.height, value);
    case "max-height":
      return testComparison(tracking, "less-than-equal", ref.height, value);
    case "orientation":
      switch (value) {
        case "landscape":
          return testComparison(tracking, "less-than", ref.height, ref.width);
        case "portrait":
          return testComparison(
            tracking,
            "greater-than-equal",
            ref.height,
            ref.width,
          );
      }
    default:
      return false;
  }
}

function getMediaFeatureValue(
  tracking: ReducerTracking,
  value: MediaFeatureValue,
) {
  if (value.type === "number") {
    return value.value;
  } else if (value.type === "length") {
    if (value.value.type === "value") {
      const length = value.value.value;
      switch (length.unit) {
        case "px":
          return length.value;
        case "rem":
          return length.value * rem.get(tracking.effect);
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
  tracking: ReducerTracking,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "range" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(tracking, feature.value);

  if (value === null || typeof value !== "number") {
    return false;
  }

  switch (feature.name) {
    case "height":
      return testComparison(tracking, feature.operator, ref.height, value);
    case "width":
      return testComparison(tracking, feature.operator, ref.width, value);
    default:
      return false;
  }
}

function testComparison(
  tracking: ReducerTracking,
  comparison: MediaFeatureComparison,
  ref: number | { get(effect: Effect): number },
  value: unknown,
) {
  ref = unwrap(ref, tracking.effect);
  value = unwrap(value, tracking.effect);

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
  tracking: ReducerTracking,
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "boolean" }>,
) {
  switch (feature.name) {
    case "prefers-reduced-motion":
      return isReduceMotionEnabled.get(tracking.effect);
    case "ltr":
      return I18nManager.isRTL === false;
    case "rtl":
      return I18nManager.isRTL;
  }
  return false;
}

function unwrap<T>(value: T | { get(effect: Effect): T }, effect: Effect): T {
  return value && typeof value === "object" && "get" in value
    ? value.get(effect)
    : (value as T);
}

function testAttributes(
  refs: Refs,
  tracking: ReducerTracking,
  conditions: AttributeCondition[],
) {
  for (const condition of conditions) {
    const props = refs.props;
    const attrValue =
      condition.type === "data-attribute"
        ? props?.["dataSet"]?.[condition.name]
        : props?.[condition.name];

    tracking.guards.push((nextRefs) => {
      const nextValue =
        condition.type === "data-attribute"
          ? nextRefs.props?.["dataSet"]?.[condition.name]
          : nextRefs.props?.[condition.name];

      return attrValue !== nextValue;
    });

    if (!testAttribute(attrValue, condition)) {
      return false;
    }
  }

  return true;
}

function testAttribute(propValue: any, condition: AttributeCondition) {
  const operation = condition.operation;

  if (operation == null) return propValue != null;

  switch (operation.operator) {
    /* These are non-standard operators */
    case "empty": {
      // Mostly used for detecting empty children
      return propValue == null || propValue == "";
    }
    case "truthy": {
      // Does the attribute exist with a truthy value
      return Boolean(propValue);
    }
    /* These are the standard operators */
    case "dash-match":
    case "prefix":
    case "substring":
    case "suffix":
      return false;
    case "includes":
      return propValue?.toString().includes(operation.value);
    case "equal": {
      return propValue?.toString() == operation.value;
    }
  }
}
