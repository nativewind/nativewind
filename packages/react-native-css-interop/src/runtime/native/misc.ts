import { createContext } from "react";
import { AccessibilityInfo, Dimensions } from "react-native";
import { createSignal } from "../signals";
import { INTERNAL_RESET, INTERNAL_SET } from "../../shared";
import {
  ContainerRuntime,
  ExtractedAnimation,
  Specificity,
  StyleMeta,
  StyleProp,
} from "../../types";

export const animationMap = new Map<string, ExtractedAnimation>();
export const globalStyles = new Map<string, StyleProp>();
export const opaqueStyles = new WeakMap<object, StyleProp>();
export const styleSpecificity = new WeakMap<object, Specificity>();
export const styleMetaMap = new WeakMap<
  NonNullable<StyleProp> | NonNullable<StyleProp>[],
  StyleMeta
>();

export class OpaqueStyleToken {}

export const ContainerContext = createContext<Record<string, ContainerRuntime>>(
  {},
);

export const vw = viewportUnit("width", Dimensions);
export const vh = viewportUnit("height", Dimensions);
function viewportUnit(key: "width" | "height", dimensions: Dimensions) {
  const signal = createSignal<number>(dimensions.get("window")[key] || 0);

  let subscription = dimensions.addEventListener("change", ({ window }) => {
    signal.set(window[key]);
  });

  const get = () => signal.get() || 0;
  const reset = (dimensions: Dimensions) => {
    signal.set(dimensions.get("window")[key] || 0);
    subscription.remove();
    subscription = dimensions.addEventListener("change", ({ window }) => {
      signal.set(window[key]);
    });
  };

  return { get, [INTERNAL_RESET]: reset, [INTERNAL_SET]: signal.set };
}

export const isReduceMotionEnabled = (function createIsReduceMotionEnabled() {
  const signal = createSignal(false);
  // Hopefully this resolves before the first paint...
  AccessibilityInfo.isReduceMotionEnabled()?.then(signal.set);
  AccessibilityInfo.addEventListener("reduceMotionChanged", signal.set);

  return { ...signal, [INTERNAL_RESET]: () => signal.set(false) };
})();
