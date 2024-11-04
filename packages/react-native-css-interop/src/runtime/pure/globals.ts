import { Appearance, Dimensions } from "react-native";
import type { ColorSchemeName, LayoutRectangle } from "react-native";
import {
  getAnimationDefaults,
  type Animation,
  type RawAnimation,
} from "./animations";
import type { StyleRuleSet, StyleValueDescriptor } from "./types";
import { isDeepEqual } from "./utils/equality";
import { family, mutable, observable, weakFamily } from "./utils/observable";

/**
 * In development, these are observable to allow for hot-reloading.
 * In production these will be static StyleRuleSets.
 */
export const styleFamily = family(() => {
  return process.env.NODE_ENV === "production"
    ? undefined //mutable<StyleRuleSet>(undefined, undefined, isDeepEqual)
    : observable<StyleRuleSet>(undefined, undefined, isDeepEqual);
});

export const variableFamily = family(() => {
  return process.env.NODE_ENV === "production"
    ? mutable<StyleValueDescriptor>(undefined, undefined, isDeepEqual)
    : observable<StyleValueDescriptor>(undefined, undefined, isDeepEqual);
});

export const animationFamily = family(() => {
  return process.env.NODE_ENV === "production"
    ? mutable(
        undefined,
        (rawAnimation: RawAnimation): Animation => {
          return {
            ...rawAnimation,
            defaults: getAnimationDefaults(rawAnimation),
          };
        },
        isDeepEqual,
      )
    : observable(
        undefined,
        (_, rawAnimation: RawAnimation): Animation => {
          return {
            ...rawAnimation,
            defaults: getAnimationDefaults(rawAnimation),
          };
        },
        isDeepEqual,
      );
});

export const rem = observable(14);

/**
 * Interactivity
 */
export const hoverFamily = weakFamily(() => {
  return observable<boolean>(false);
});

export const activeFamily = weakFamily(() => {
  return observable<boolean>(false);
});

export const focusFamily = weakFamily(() => {
  return observable<boolean>(false);
});

/**
 * Dimensions
 */
const dimensions = observable(Dimensions.get("window"));
export const vw = observable((read) => read(dimensions).width);
export const vh = observable((read) => read(dimensions).height);

/**
 * Color schemes
 */
export const systemColorScheme = observable<ColorSchemeName>();
export const appColorScheme = observable(
  (get) => {
    const value = get(systemColorScheme);
    return get(systemColorScheme) === undefined
      ? Appearance.getColorScheme()
      : value;
  },
  (set, value: ColorSchemeName) => {
    set(systemColorScheme, value);
    return value === undefined ? Appearance.getColorScheme() : value;
  },
);

/**
 * Containers
 */
export const containerLayoutFamily = weakFamily(() => {
  return observable<LayoutRectangle>();
});

export const containerWidthFamily = weakFamily((key) => {
  return observable((get) => {
    return get(containerLayoutFamily(key))?.width || 0;
  });
});

export const containerHeightFamily = weakFamily((key) => {
  return observable((get) => {
    return get(containerLayoutFamily(key))?.width || 0;
  });
});
