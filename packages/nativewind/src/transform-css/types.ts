import { walk, CssNode, CssNodeCommon, Raw } from "css-tree";
import {
  ColorValue,
  ImageStyle,
  TextStyle,
  TransformsStyle,
  ViewStyle,
} from "react-native";

export interface Atom {
  styles?: AtomStyle[];
  atRules?: Record<number, Array<AtRuleTuple>>;
  conditions?: string[];
  variables?: Array<Record<`--${string}`, VariableValue>>;
  subscriptions?: string[];
  childClasses?: string[];
  parent?: string;
  meta?: Record<string, boolean | string>;
}

export interface SelectorMeta {
  subscriptions: string[];
  conditions: string[];
  atRules: AtRuleTuple[];
  variables: Array<Record<string, VariableValue>>;
}

export type Style = ViewStyle & TextStyle & ImageStyle;
export type AtRuleTuple = [string] | [string, string | number];

type InferArray<T> = T extends Array<infer K> ? K : never;
export type Transform = InferArray<NonNullable<TransformsStyle["transform"]>>;

export type StyleValue =
  | string
  | number
  | string[]
  | Transform
  | TransformsStyle["transform"]
  | FunctionValue
  | CssNode
  | undefined;

export type AtomStyle = {
  [T in keyof Style]: Style[T] | FunctionValue;
};

export type AtomRecord = Record<string, Atom>;

export type FunctionValue = {
  function: string;
  values: Array<VariableValue>;
};

export type VariableValue = string | number | FunctionValue | ColorValue;

export const skip = (walk as unknown as Record<string, unknown>).skip;

export function isFunctionValue(value: StyleValue): value is FunctionValue {
  return typeof value === "object" && "function" in value;
}

export function isCssNode(value: StyleValue): value is CssNode {
  return typeof value === "object" && "type" in value;
}

export function isRaw(
  node?: CssNodeCommon | null
): node is Raw | null | undefined {
  return node?.type === "Raw";
}
