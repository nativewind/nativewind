import { defaultValues, setValue } from "../utils/properties";
import type { RawAnimation } from "./types";

export function getAnimationDefaults(rawAnimation: RawAnimation) {
  const style: Record<string, any> = {};

  for (const frame of rawAnimation.p) {
    const prop = frame[0];
    setValue(style, prop, defaultValues[prop]);
  }

  return style;
}
