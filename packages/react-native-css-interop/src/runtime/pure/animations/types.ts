import type { Animation as CSSAnimation, EasingFunction } from "lightningcss";
import type { makeMutable, SharedValue } from "react-native-reanimated";

import type { StyleValueDescriptor } from "../types";

export type RawAnimation = {
  p: AnimationInterpolation[];
  // The easing function for each frame
  e?: AnimationEasing[];
};

export type Animation = RawAnimation & {
  defaults: Record<string, any>;
};

export type ReanimatedMutable<Value> = ReturnType<typeof makeMutable<Value>>;
export type AnimationMutable = ReanimatedMutable<number>;

export type AnimationAttributes = {
  [K in keyof CSSAnimation]?: CSSAnimation[K][];
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
