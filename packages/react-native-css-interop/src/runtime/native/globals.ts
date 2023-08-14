import { createContext } from "react";
import {
  ContainerRuntime,
  ExtractedAnimation,
  ExtractionWarning,
  StyleMeta,
  StyleProp,
} from "../../types";
import { AccessibilityInfo, Dimensions, Platform } from "react-native";
import { createSignal } from "../signals";
import { INTERNAL_RESET, INTERNAL_SET } from "../../shared";

export const animationMap = new Map<string, ExtractedAnimation>();
export const globalStyles = new Map<string, StyleProp>();
export const opaqueStyles = new WeakMap<object, StyleProp>();
export const styleMetaMap = new WeakMap<
  NonNullable<StyleProp> | NonNullable<StyleProp>[],
  StyleMeta
>();

export class OpaqueStyleToken {
  opaqueStyleToken = true;
}

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export const ContainerContext = createContext<Record<string, ContainerRuntime>>(
  {},
);

export const rem = createRem(14);
export const vw = viewportUnit("width", Dimensions);
export const vh = viewportUnit("height", Dimensions);
export const isReduceMotionEnabled = createIsReduceMotionEnabled();

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

function createRem(defaultValue: number) {
  const signal = createSignal<number>(defaultValue);

  const get = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const value = Number.parseFloat(
        window.document.documentElement.style.getPropertyValue("font-size"),
      );

      if (Number.isNaN(value)) {
        return 16;
      }
    }

    return signal.get() || 14;
  };

  const set = (nextValue: number) => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      if (Number.isNaN(nextValue)) {
        return;
      }

      window.document.documentElement.style.setProperty(
        "font-size",
        `${nextValue}px`,
      );
    } else {
      signal.set(nextValue);
    }
  };

  const reset = () => {
    set(defaultValue);
  };

  return { get, set, [INTERNAL_RESET]: reset };
}

function createIsReduceMotionEnabled() {
  const signal = createSignal(false);
  AccessibilityInfo.isReduceMotionEnabled()?.then(signal.set);
  AccessibilityInfo.addEventListener("reduceMotionChanged", signal.set);

  return { ...signal, [INTERNAL_RESET]: () => signal.set(false) };
}
