import { animationFamily } from "../globals";
import { resolveValue, type ResolveOptions } from "../resolvers";
import type { ConfigReducerState } from "../state/config";
import type { Effect } from "../utils/observable";
import type { AnimationInterpolation, SharedValueInterpolation } from "./types";

export function getAnimationIO(
  state: ConfigReducerState,
  effect: Effect,
  options: ResolveOptions,
) {
  const sharedValues = state.declarations?.sharedValues;
  if (!sharedValues) return;

  const animationNames = state.declarations?.animation?.findLast(
    (value) => "name" in value,
  )?.name;

  if (!animationNames) return;

  const sharedValueIO: SharedValueInterpolation[] = [];

  for (const name of animationNames) {
    if (name.type === "none") {
      continue;
    }

    const sharedValue = sharedValues.get(name.value);

    const animation = effect.get(animationFamily(name.value));
    if (!animation || !sharedValue) {
      continue;
    }

    const animationInterpolation: AnimationInterpolation[] = [];

    for (const interpolation of animation.p) {
      animationInterpolation.push([
        interpolation[0],
        interpolation[1],
        interpolation[2].map((value) => {
          return resolveValue(state, value, options);
        }),
        interpolation[3],
      ] as const);
    }

    sharedValueIO.push([sharedValue, animationInterpolation]);
  }

  return sharedValueIO;
}
