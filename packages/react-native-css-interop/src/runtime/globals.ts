import {
  ExtractedAnimation,
  InteropFunction,
  Specificity,
  StyleMeta,
  StyleProp,
} from "../types";

export const defaultInteropRef = {
  current: (() => [""]) as InteropFunction,
};

export const animationMap = new Map<string, ExtractedAnimation>();
export const globalStyles = new Map<string, StyleProp>();
export const opaqueStyles = new WeakMap<object, StyleProp>();
export const styleSpecificity = new WeakMap<object, Specificity>();
export const styleMetaMap = new WeakMap<NonNullable<StyleProp>, StyleMeta>();
