import { animationFamily } from "../globals";
import { resolveValue, type ResolveOptions } from "../resolvers";
import type { ConfigReducerState } from "../state/config";
import type { Styles } from "../styles";
import type { AnimationInterpolation, SharedValueInterpolation } from "./types";

export function applyAnimation(
  state: ConfigReducerState,
  styles: Styles,
  options: ResolveOptions,
) {
  const sharedValues = state.declarations?.sharedValues;
  if (!sharedValues) return styles;

  const sharedValueIO: SharedValueInterpolation[] = [];

  for (const name of sharedValues.keys()) {
    if (name === "none") {
      continue;
    }

    const sharedValue = sharedValues.get(name);

    const animation = styles.get(animationFamily(name));
    if (!animation || !sharedValue) {
      continue;
    }

    const animationInterpolation: AnimationInterpolation[] = [];
    styles.baseStyles ??= {};
    Object.assign(styles.baseStyles, animation.baseStyles);

    for (const interpolation of animation.animation[0]) {
      if (!interpolation[3]) {
        animationInterpolation.push(interpolation);
        continue;
      }

      const values = [];
      for (const value of interpolation[2]) {
        values.push(resolveValue(value, options));
      }

      animationInterpolation.push([
        interpolation[0],
        interpolation[1],
        values,
        interpolation[3],
        interpolation[4],
      ]);
    }

    sharedValueIO.push([sharedValue, animationInterpolation]);
  }

  styles.animationIO = sharedValueIO;
}
