import {
  AnimationIterationCount,
  EasingFunction as CSSEasingFunction,
  Declaration,
  KeyframesRule,
} from "lightningcss";

import { CompilerCollection } from "../runtime/pure/compiler/types";
import {
  AnimationInterpolation,
  AnimationInterpolationType,
  EasingFunction,
  RawAnimation,
} from "../runtime/pure/reanimated";
import { RuntimeValueDescriptor } from "../types";
import { toRNProperty } from "./normalize-selectors";
import { parseDeclaration } from "./parseDeclaration";

export function parseIterationCount(
  value: AnimationIterationCount[],
): number[] {
  return value.map((value) => {
    return value.type === "infinite" ? -1 : value.value;
  });
}

export function parseEasingFunction(
  value: CSSEasingFunction[],
): EasingFunction[] {
  return value.map((value) => {
    switch (value.type) {
      case "linear":
      case "ease":
      case "ease-in":
      case "ease-out":
      case "ease-in-out":
        return value.type;
      case "cubic-bezier":
        return value;
      case "steps":
        return {
          type: "steps",
          c: value.count,
          p: value.position?.type,
        };
    }
  });
}

export function extractKeyFrames(
  keyframes: KeyframesRule<Declaration>,
  collection: CompilerCollection,
  // getStyles: (declarations: Declaration[]) => StyleRule[],
) {
  const propertyMap = new Map<string, AnimationInterpolation>();

  for (const frame of keyframes.keyframes) {
    if (!frame.declarations.declarations) continue;

    const selectors = frame.selectors.map((selector) => {
      switch (selector.type) {
        case "percentage":
          return selector.value;
        case "from":
          return 0;
        case "to":
          return 1;
        case "timeline-range-percentage":
          // TODO
          return selector.value.percentage;
      }
    });

    for (const declaration of frame.declarations.declarations) {
      parseDeclaration(
        declaration,
        collection,
        (type, property, value) => {
          if (value === undefined) return;

          switch (type) {
            case "transition":
              // These are ignores
              return;
            case "transform":
            case "animation":
              // TODO
              return;
            case "style": {
              value = value as RuntimeValueDescriptor;

              property = toRNProperty(property);

              let interpolation = propertyMap.get(property);

              if (!interpolation) {
                interpolation = [property, [], []];
                propertyMap.set(property, interpolation);
              }

              if (typeof value === "object") {
                interpolation[3] = 1;
              } else if (typeof value === "string") {
                if (!interpolation[4]) {
                  interpolation[3] ??= 0;
                  interpolation[4] = value.replace(
                    /[\d\.]*/g,
                    "",
                  ) as AnimationInterpolationType;
                }

                value = Number.parseFloat(value);
              }

              for (const selector of selectors) {
                interpolation[1].push(selector);
                interpolation[2].push(value);
              }
            }
          }
        },
        () => {},
      );
    }
  }

  const sortedInterpolation = Array.from(
    propertyMap.values(),
    ([property, selectors, values, ...rest]): AnimationInterpolation => {
      const indices = Array.from(selectors.keys());
      indices.sort((a, b) => selectors[a] - selectors[b]);

      return [
        property,
        indices.map((i) => selectors[i]),
        indices.map((i) => values[i]),
        ...rest,
      ];
    },
  );

  /**
   * Sort the values by selector to be in ascending order
   */
  const animation: RawAnimation = [sortedInterpolation];

  collection.animations.set(keyframes.name.value, animation);
}
