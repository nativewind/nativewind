import {
  ContainerCondition,
  Declaration,
  MediaFeatureComparison,
  MediaFeatureValue,
  MediaQuery,
  QueryFeatureFor_MediaFeatureId,
} from "lightningcss";

import {
  ContainerRuntime,
  ExtractedContainerQuery,
  Interaction,
  PseudoClassesQuery,
  SignalLike,
} from "../../types";
import { colorScheme, isReduceMotionEnabled, rem, vh, vw } from "./globals";
import { exhaustiveCheck } from "../../shared";
import { Platform } from "react-native";

interface ConditionReference {
  width: number | SignalLike<number>;
  height: number | SignalLike<number>;
}

/**
 * Test a media query against current conditions
 */
export function testMediaQuery(
  mediaQuery: MediaQuery,
  conditionReference: ConditionReference = {
    width: vw,
    height: vh,
  },
) {
  const pass = testCondition(mediaQuery.condition, conditionReference);
  return mediaQuery.qualifier === "not" ? !pass : pass;
}

export function testPseudoClasses(
  interaction: Interaction | undefined,
  meta: PseudoClassesQuery,
) {
  if (meta.active && !interaction?.active.get()) return false;
  if (meta.hover && !interaction?.hover.get()) return false;
  if (meta.focus && !interaction?.focus.get()) return false;
  return true;
}

export function testContainerQuery(
  containerQuery: ExtractedContainerQuery[] | undefined,
  containers: Record<string, ContainerRuntime> = {},
) {
  // If there is no query, we passed
  if (!containerQuery || containerQuery.length === 0) {
    return true;
  }

  return containerQuery.every((query) => {
    // If the query has a name, but the container doesn't exist, we failed
    if (query.name && !containers[query.name]) return false;

    // If the query has a name, we use the container with that name
    // Otherwise default to the last container
    const container = query.name
      ? containers[query.name]
      : containers.__default;

    // We failed if the container doesn't exist (e.g no default container)
    if (!container) return false;

    if (
      query.pseudoClasses &&
      !testPseudoClasses(container.interaction, query.pseudoClasses)
    ) {
      return false;
    }

    // If there is no condition, we passed (maybe only named as specified)
    if (!query.condition) return true;

    return testCondition(query.condition, {
      width: container.interaction.layout.width,
      height: container.interaction.layout.height,
    });
  });
}

/**
 * Test a media condition against current conditions
 * This is also used for container queries
 */
export function testCondition(
  condition: ContainerCondition<Declaration> | null | undefined,
  conditionReference: ConditionReference,
): boolean {
  if (!condition) return true;

  if (condition.type === "operation") {
    if (condition.operator === "and") {
      return condition.conditions.every((c) =>
        testCondition(c, conditionReference),
      );
    } else {
      return condition.conditions.some((c) =>
        testCondition(c, conditionReference),
      );
    }
  } else if (condition.type === "not") {
    return !testCondition(condition.value, conditionReference);
  } else if (condition.type === "style") {
    // TODO
    return false;
  }

  return testFeature(condition.value, conditionReference);
}

function testFeature(
  feature: QueryFeatureFor_MediaFeatureId,
  conditionReference: ConditionReference,
) {
  switch (feature.type) {
    case "plain":
      return testPlainFeature(feature, conditionReference);
    case "range":
      return testRange(feature, conditionReference);
    case "boolean":
      return testBoolean(feature);
    case "interval":
      return false;
    default:
      exhaustiveCheck(feature);
  }

  return false;
}

function testPlainFeature(
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "plain" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(feature.value);

  if (value === null) {
    return false;
  }

  switch (feature.name) {
    case "display-mode":
      return value === "native" || Platform.OS === value;
    case "prefers-color-scheme":
      return colorScheme.get() === value;
    case "width":
      return testComparison("equal", ref.width, value);
    case "min-width":
      return testComparison("greater-than-equal", ref.width, value);
    case "max-width":
      return testComparison("less-than-equal", ref.width, value);
    case "height":
      return testComparison("equal", ref.height, value);
    case "min-height":
      return testComparison("greater-than-equal", ref.height, value);
    case "max-height":
      return testComparison("less-than-equal", ref.height, value);
    default:
      return false;
  }
}

function getMediaFeatureValue(value: MediaFeatureValue) {
  if (value.type === "number") {
    return value.value;
  } else if (value.type === "length") {
    if (value.value.type === "value") {
      const length = value.value.value;
      switch (length.unit) {
        case "px":
          return length.value;
        case "rem":
          return length.value * rem.get();
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
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "range" }>,
  ref: ConditionReference,
) {
  const value = getMediaFeatureValue(feature.value);

  if (value === null || typeof value !== "number") {
    return false;
  }

  switch (feature.name) {
    case "height":
      return testComparison(feature.operator, ref.height, value);
    case "width":
      return testComparison(feature.operator, ref.width, value);
    default:
      return false;
  }
}

function testComparison(
  comparison: MediaFeatureComparison,
  ref: number | SignalLike<number>,
  value: unknown,
) {
  if (typeof value !== "number") return false;
  switch (comparison) {
    case "equal":
      return unwrap(ref) === value;
    case "greater-than":
      return unwrap(ref) > value;
    case "greater-than-equal":
      return unwrap(ref) >= value;
    case "less-than":
      return unwrap(ref) < value;
    case "less-than-equal":
      return unwrap(ref) < value;
  }
}

function testBoolean(
  feature: Extract<QueryFeatureFor_MediaFeatureId, { type: "boolean" }>,
) {
  switch (feature.name) {
    case "prefers-reduced-motion":
      return isReduceMotionEnabled.get();
  }
  return false;
}

function unwrap<T>(value: T | SignalLike<T>): T {
  return value && typeof value === "object" && "get" in value
    ? value.get()
    : value;
}
