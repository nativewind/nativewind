import { defaultValues, setValue } from "../utils/properties";
import type { Animation, RawAnimation } from "./types";

export function writeAnimation(_: unknown, animation: RawAnimation): Animation {
  const baseStyles: Record<string, any> = {};

  for (const frame of animation[0]) {
    const prop = frame[0];
    setValue(baseStyles, prop, defaultValues[prop]);
  }

  return { animation, baseStyles };
}
