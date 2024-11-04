import type { AnimationAttributes, TransitionAttributes } from "../reanimated";
import { ResolveOptions } from "../resolvers";
import { ConfigReducerState } from "../state/config";
import type {
  AttributeCondition,
  ContainerQuery,
  MediaQuery,
  PseudoClassesQuery,
} from "./conditions";
import type { Container } from "./container";

export interface StyleRuleSet {
  // [StyleRuleSetSymbol]: true;
  // Normal Rules
  n?: StyleRule[];
  // Important Rules
  i?: StyleRule[];
}

export interface StyleRule {
  // Specificity
  s: any;
  // Declarations
  d?: StyleDeclaration[];
  // Variables
  v?: [string, RuntimeFunction][];
  // Named Containers
  c?: Partial<Container>;

  /**
   * Conditionals
   */

  // MediaQuery
  m?: MediaQuery[];
  // PseudoClassesQuery
  p?: PseudoClassesQuery;
  // Container Query
  q?: ContainerQuery[];
  // Attribute Conditions
  ac?: AttributeCondition[];

  /**
   * Animations and Transitions
   */

  // Animations
  a?: AnimationAttributes;
  // Transitions
  t?: TransitionAttributes;
}

export type StyleAttribute = string;
export type StyleDeclaration =
  // This is a static style object
  | Record<string, unknown>
  // A static style that that is assigned to a different prop
  | [Record<string, unknown>, StyleAttribute | StyleAttribute[]]
  // A value that is deeply nested (e.g. `transform`)
  | [string | number, StyleAttribute | StyleAttribute[]]
  // A value that can only be computed at runtime
  | [RuntimeFunction, StyleAttribute | StyleAttribute[]]
  // A value that can only be computed at runtime, and only after styles have been calculated
  | [RuntimeFunction, StyleAttribute | StyleAttribute[], 1];

export type StyleValueDescriptor =
  | string
  | number
  | boolean
  | undefined
  | RuntimeFunction
  | StyleValueDescriptor[];

export type RuntimeFunction =
  | [
      Record<never, never>,
      string, // string
    ]
  | [
      Record<never, never>,
      string, // string
      undefined | StyleValueDescriptor[], // arguments
    ]
  | [
      Record<never, never>,
      string, // string
      undefined | StyleValueDescriptor[], // arguments
      1, // Should process after styles have been calculated
    ];

export type InlineStyle =
  | Record<string, unknown>
  | undefined
  | null
  | (Record<string, unknown> | undefined | null)[];

export type StyleValueResolver = (
  state: ConfigReducerState,
  value: unknown,
  options: ResolveOptions,
) => any;

export type StyleValueSubResolver<T = unknown> = (
  resolveValue: StyleValueResolver,
  state: ConfigReducerState,
  value: T,
  options: ResolveOptions,
) => any;
