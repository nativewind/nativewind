import { defaultValues, setValue } from "../utils/properties";
import type { Animation, RawAnimation } from "./types";

export function writeAnimation(
  _: unknown,
  rawAnimation: RawAnimation,
): Animation {
  const baseStyles: Record<string, any> = {};

  for (const frame of rawAnimation.p) {
    const prop = frame[0];
    setValue(baseStyles, prop, defaultValues[prop]);
  }

  return { ...rawAnimation, baseStyles };
}
