import { CssNode } from "css-tree";
import {
  ImageStyle,
  OpaqueColorValue,
  TextStyle,
  TransformsStyle,
  ViewStyle,
} from "react-native";

export interface Atom {
  styles?: AtomStyle[];
  atRules?: Record<number, Array<AtRuleTuple>>;
  conditions?: string[];
  variables?: Array<Record<string, VariableValue>>;
  topics?: string[];
  topicSubscription?: () => void;
  childClasses?: string[];
  meta?: Record<string, true>;
}

export type Style = ViewStyle & TextStyle & ImageStyle;
export type AtRuleTuple = [string] | [string, string | number];

type InferArray<T> = T extends Array<infer K> ? K : never;
export type Transform = InferArray<NonNullable<TransformsStyle["transform"]>>;

export type DeclarationAtom = Required<
  Pick<Atom, "styles" | "topics" | "variables">
>;

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

export type VariableValue = string | number | FunctionValue | OpaqueColorValue;

export function isFunctionValue(value: StyleValue): value is FunctionValue {
  return typeof value === "object" && "function" in value;
}

export function isCssNode(value: StyleValue): value is CssNode {
  return typeof value === "object" && "type" in value;
}
