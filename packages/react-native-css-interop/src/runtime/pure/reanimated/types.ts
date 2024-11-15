import type {
  AnimationDirection,
  AnimationFillMode,
  AnimationPlayState,
} from "lightningcss";
import type { makeMutable, SharedValue } from "react-native-reanimated";

import type { StyleValueDescriptor } from "../types";

/******************************** Animations ******************************** */

export type RawAnimation = {
  p: AnimationInterpolation[];
  // The easing function for each frame
  e?: AnimationEasing[];
};

export type Animation = RawAnimation & {
  baseStyles: Record<string, any>;
};

export type ReanimatedMutable<Value> = ReturnType<typeof makeMutable<Value>>;
export type AnimationMutable = ReanimatedMutable<number>;

export type AnimationAttributes = {
  /**
   * The animation delay.
   */
  de?: number[];
  /**
   * The direction of the animation.
   */
  di?: AnimationDirection[];
  /**
   * The animation duration.
   */
  du?: number[];
  /**
   * The animation fill mode.
   */
  f?: AnimationFillMode[];
  /**
   * The number of times the animation will run.
   */
  i?: number[];
  /**
   * The animation name.
   */
  n?: string[];
  /**
   * The current play state of the animation.
   */
  p?: AnimationPlayState[];
  /**
   * The animation timeline.
   */
  t?: never[];
  /**
   * The easing function for the animation.
   */
  e?: EasingFunction[];
};

export type EasingFunction =
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | {
      type: "cubic-bezier";
      /**
       * The x-position of the first point in the curve.
       */
      x1: number;
      /**
       * The x-position of the second point in the curve.
       */
      x2: number;
      /**
       * The y-position of the first point in the curve.
       */
      y1: number;
      /**
       * The y-position of the second point in the curve.
       */
      y2: number;
    }
  | {
      type: "steps";
      /**
       * The number of intervals in the function.
       */
      c: number;
      /**
       * The step position.
       */
      p?: "start" | "end" | "jump-none" | "jump-both";
    };

type AnimationPropertyKey = string;
export type AnimationInterpolation =
  | [AnimationPropertyKey, number[], StyleValueDescriptor[]]
  | [
      AnimationPropertyKey,
      number[],
      StyleValueDescriptor[],
      AnimationInterpolationType,
    ];
export type AnimationEasing = number | [number, EasingFunction];
export type AnimationInterpolationType = "color" | "%" | undefined;

export type SharedValueInterpolation = [
  SharedValue<number>,
  AnimationInterpolation[],
];

/******************************* Transitions ******************************** */

export type TransitionDeclarations = {
  transition?: TransitionAttributes;
  sharedValues?: Map<string, ReanimatedMutable<any>>;
};

export type Transition = [string | string[], ReanimatedMutable<any>];

export type TransitionStyles = {
  transitions?: Map<Transition[0], Transition[1]>;
};

export type TransitionAttributes = {
  /**
   * Delay before the transition starts in milliseconds.
   */
  d?: number[];
  /**
   * Duration of the transition in milliseconds.
   */
  l?: number[];
  /**
   * Property to transition.
   */
  p?: string[];
  /**
   * Easing function for the transition.
   */
  t?: EasingFunction[];
};
