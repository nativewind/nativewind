import {
  AnimationIterationCount,
  EasingFunction as CSSEasingFunction,
  Declaration,
  KeyframesRule,
} from "lightningcss";

import { CompilerCollection } from "../runtime/pure/compiler/types";
import { EasingFunction } from "../runtime/pure/reanimated";

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
) {
  // const animation: RawAnimation = { p: [] };
  // let rawFrames: Array<{
  //   selector: number;
  //   values: StyleDeclaration[];
  //   easingFunction?: EasingFunction;
  // }> = [];
  // for (const frame of keyframes.keyframes) {
  //   if (!frame.declarations.declarations) continue;
  //   const specificity: Specificity = [];
  //   specificity[SpecificityIndex.Important] = 2; // Animations have higher specificity than important
  //   specificity[SpecificityIndex.ClassName] = 1;
  //   specificity[SpecificityIndex.Order] = collection.appearanceOrder;
  //   const { d: declarations, animations } = declarationsToStyle(
  //     frame.declarations.declarations,
  //     collection,
  //     specificity,
  //     {},
  //   );
  //   if (!declarations) continue;
  //   /**
  //    * We an only animation style props
  //    * Non-style props have pathTokens instead of a single string
  //    */
  //   const values = declarations.filter(
  //     (declaration) =>
  //       declaration.length === 1 || typeof declaration[1] === "string",
  //   );
  //   if (values.length === 0) continue;
  //   const easingFunction = animations?.timingFunction?.[0];
  //   for (const selector of frame.selectors) {
  //     const keyframe =
  //       selector.type === "percentage"
  //         ? selector.value * 100
  //         : selector.type === "from"
  //           ? 0
  //           : selector.type === "to"
  //             ? 100
  //             : undefined;
  //     if (keyframe === undefined) continue;
  //     switch (selector.type) {
  //       case "percentage":
  //         rawFrames.push({ selector: selector.value, values, easingFunction });
  //         break;
  //       case "from":
  //         rawFrames.push({ selector: 0, values, easingFunction });
  //         break;
  //       case "to":
  //         rawFrames.push({ selector: 1, values, easingFunction });
  //         break;
  //       case "timeline-range-percentage":
  //         break;
  //       default:
  //         selector satisfies never;
  //     }
  //   }
  // }
  // // Need to sort afterwards, as the order of the frames is not guaranteed
  // rawFrames = rawFrames.sort((a, b) => a.selector - b.selector);
  // // Convert the rawFrames into frames
  // const frames: Record<string, AnimationFrame> = {};
  // const easingFunctions: EasingFunction[] = [];
  // for (let i = 0; i < rawFrames.length; i++) {
  //   const rawFrame = rawFrames[i];
  //   const progress = rawFrame.selector;
  //   if (rawFrame.easingFunction) {
  //     easingFunctions[i] = rawFrame.easingFunction;
  //   }
  //   for (const frameValue of rawFrame.values) {
  //     const [value, propOrPathTokens] = frameValue;
  //     // We only accept animations on the `style` prop, which are either undefined or a string
  //     if (Array.isArray(propOrPathTokens)) {
  //       continue;
  //     }
  //     if (propOrPathTokens) {
  //       const key = propOrPathTokens;
  //       if (!isRuntimeDescriptor(value)) {
  //         throw new Error("animation is an object?");
  //       }
  //       if (!frames[key]) {
  //         frames[key] = [key, []];
  //       }
  //       frames[key][1].push({ value, progress });
  //     } else if (value && typeof value === "object" && !Array.isArray(value)) {
  //       for (const key in value) {
  //         if (!frames[key]) {
  //           frames[key] = [key, []];
  //         }
  //         frames[key][1].push({ value: value[key], progress });
  //       }
  //     }
  //   }
  // }
  // /**
  //  * Ensure all animations have a 0%/100% frame.
  //  *
  //  * As per mdn:
  //  * If a keyframe rule doesn't specify the start or end states of the animation (that is, 0%/from and 100%/to),
  //  * browsers will use the element's existing styles for the start/end states.
  //  * This can be used to animate an element from its initial state and back.
  //  */
  // animation.p = Object.values(frames).map((value) => {
  //   const valueFrames = value[1];
  //   if (valueFrames[0].progress !== 0) {
  //     valueFrames.unshift({ value: "!INHERIT!", progress: 0 });
  //   }
  //   if (valueFrames[valueFrames.length - 1].progress !== 1) {
  //     valueFrames.push({ value: "!INHERIT!", progress: 1 });
  //   }
  //   return value;
  // });
  // if (easingFunctions.length) {
  //   // This is a holey array and may contain undefined values
  //   animation.p = Array.from<EasingFunction | undefined>(
  //     easingFunctions,
  //   ).map((value) => {
  //     if (!value) {
  //       return "!PLACEHOLDER!"
  //     }
  //     return value ?? ;
  //   });
  // }
  // collection.keyframes.set(keyframes.name.value, animation);
}
