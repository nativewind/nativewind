import type {
  MediaQuery,
  Animation,
  ContainerType,
  Time,
  EasingFunction,
  ContainerCondition,
  Declaration,
} from "lightningcss";
import {
  ComponentClass,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactNode,
  createElement,
} from "react";
import {
  Appearance,
  Dimensions,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";
import { INTERNAL_FLAGS, INTERNAL_RESET } from "./shared";
import type { NormalizedOptions } from "./runtime/native/prop-mapping";
import { Signal } from "./runtime/signals";

export type CssToReactNativeRuntimeOptions = {
  inlineRem?: number | false;
  grouping?: (string | RegExp)[];
  ignorePropertyWarningRegex?: (string | RegExp)[];
  selectorPrefix?: string;
  stylesheetOrder?: number;
  experiments?: {
    inlineAnimations?: true;
  };
};

export interface ExtractRuleOptions extends CssToReactNativeRuntimeOptions {
  declarations: Map<string, CompilerStyleMeta[]>;
  keyframes: Map<string, ExtractedAnimation>;
  grouping: RegExp[];
  darkMode?: DarkMode;
  rootVariables: StyleSheetRegisterOptions["rootVariables"];
  universalVariables: StyleSheetRegisterOptions["universalVariables"];
  flags: Record<string, unknown>;
  selectorPrefix?: string;
  appearanceOrder: number;
  rem?: StyleSheetRegisterOptions["rem"];
}

export type EnableCssInteropOptions<P> = {
  [K in string]?: CSSInteropClassNamePropConfig<P>;
};

export type NormalizedCSSInteropClassNamePropConfig<P> = {
  target: (keyof P & string) | boolean;
  nativeStyleToProp?: NativeStyleToProp<P>;
};

export type CSSInteropClassNamePropConfig<P> =
  | undefined
  | (keyof P & string)
  | boolean
  | NormalizedCSSInteropClassNamePropConfig<P>;

export type NativeStyleToProp<P> = {
  [K in keyof Style & string]?: K extends keyof P ? keyof P | true : keyof P;
};

export type RemapProps<P> = {
  [K in string]?: (keyof P & string) | true | undefined;
};

export type ComponentTypeWithMapping<P, M> = ComponentType<
  P & { [K in keyof M]?: string }
>;

export type ComponentType<P> =
  | ForwardRefExoticComponent<P>
  | FunctionComponent<P>
  | ComponentClass<P>
  | string;

export type JSXFunction<P> = (
  type: ComponentType<P>,
  props: P,
  key: string | undefined,
  ...args: unknown[]
) => any;

export type BasicInteropFunction = <P>(
  jsx: JSXFunction<P>,
  type: ComponentType<P>,
  props: P,
  key: string | undefined,
  ...args: unknown[]
) => any;

export type InteropFunction = (
  type: any,
  options: NormalizedOptions,
  props: Record<string, any>,
  children: ReactNode,
) => Parameters<typeof createElement>;

export type NewInteropFunction = <P extends Record<string, any>>(
  options: NormalizedOptions,
  props: P,
  key: string | undefined,
  ...args: unknown[]
) => any;

export type InteropFunctionOptions<P> = {
  remappedProps: P;
  options: NormalizedOptions;
  dependencies: unknown[];
  useWrapper: boolean;
};

export type CompilerStyleMeta = {
  specificity: Specificity;
  media?: MediaQuery[];
  variables?: Array<[string, RuntimeValueDescriptor]>;
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: Partial<ExtractedContainer>;
  containerQuery?: ExtractedContainerQuery[];
  transition?: ExtractedTransition;
  requiresLayoutWidth?: boolean;
  requiresLayoutHeight?: boolean;
  props: Record<string, Record<string, RuntimeValueDescriptor>>;
  propSingleValue: Record<string, PropRuntimeValueDescriptor>;
  hoistedStyles?: [string, string, "transform" | "shadow"][];
  scope: number;
  warnings?: ExtractionWarning[];
};

export type GroupedTransportStyles = {
  0?: TransportStyle[];
  1?: TransportStyle[];
  2?: TransportStyle[];
  warnings?: ExtractionWarning[];
  scope: number;
};

export type TransportStyle = Omit<
  CompilerStyleMeta,
  "props" | "propSingleValue"
> & {
  props?: Array<
    [
      string,
      PropRuntimeValueDescriptor | Array<[string, RuntimeValueDescriptor]>,
    ]
  >;
};

export type GroupedRuntimeStyle = {
  0?: RuntimeStyle[];
  1?: RuntimeStyle[];
  2?: RuntimeStyle[];
  scope: number;
};

export type RuntimeStyle = Omit<TransportStyle, "props"> & {
  $$type: "runtime";
  props?: Array<[string, RuntimeValue | Record<string, RuntimeValue>]>;
};

export type Layer = GroupedRuntimeStyle & {
  classNames: string;
};

export type RuntimeValueDescriptor =
  | string
  | number
  | {
      name: string;
      arguments: any[];
    };

export type PropRuntimeValueDescriptor = {
  $$type: "prop";
  value: RuntimeValueDescriptor;
};

export type RuntimeValue = string | number | undefined | (() => RuntimeValue);

export type Specificity = {
  /** IDs - https://drafts.csswg.org/selectors/#specificity-rules */
  A: number;
  /** Classes, Attributes, Pseudo-Classes - https://drafts.csswg.org/selectors/#specificity-rules */
  B: number;
  /** Elements, Pseudo-Elements - https://drafts.csswg.org/selectors/#specificity-rules */
  C: number;
  /** Importance - https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#cascading_order */
  I: number;
  /** StyleSheet Order */
  S: number;
  /** Appearance Order */
  O: number;
  /** Inline */
  inline?: number;
};

export interface SignalLike<T = unknown> {
  get(): T;
}

export type InteropMeta<P extends Record<string, unknown>> = {
  interopMeta: true;
  animatedProps: Set<keyof P>;
  animationInteropKey?: string;
  convertToPressable: boolean;
  transitionProps: Set<keyof P>;
  requiresLayout: boolean;
};

export type Interaction = {
  active?: Signal<boolean>;
  hover?: Signal<boolean>;
  focus?: Signal<boolean>;
};

export type ExtractedContainer = {
  names?: string[] | false;
  type: ContainerType;
};

export type GetInteraction = <T extends keyof Interaction>(
  name: T,
) => NonNullable<Interaction[T]>;

export type ContainerRuntime = {
  type: ContainerType;
  style: Style;
  getInteraction: GetInteraction;
};

export type ExtractedContainerQuery = {
  name?: string | null;
  condition?: ContainerCondition<Declaration>;
  pseudoClasses?: PseudoClassesQuery;
};

export type ExtractedAnimations = {
  [K in keyof Animation]?: Animation[K][];
};

export type ExtractedTransition = {
  /**
   * The delay before the transition starts.
   */
  delay?: Time[];
  /**
   * The duration of the transition.
   */
  duration?: Time[];
  /**
   * The property to transition.
   */
  property?: AnimatableCSSProperty[];
  /**
   * The easing function for the transition.
   */
  timingFunction?: EasingFunction[];
};

export type ExtractedAnimation = {
  frames: Record<string, RuntimeValueFrame[]>;
  hoistedStyles?: [string, string, "transform" | "shadow"][];
  requiresLayoutWidth?: boolean;
  requiresLayoutHeight?: boolean;
};

export type RuntimeValueFrame = {
  progress: number;
  value: RuntimeValueDescriptor;
};

export type PseudoClassesQuery = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};

export type StyleSheetRegisterCompiledOptions = {
  declarations?: [string, GroupedTransportStyles][];
  keyframes?: Record<string, ExtractedAnimation>;
  rootVariables?: Record<string, VariableRecord>;
  universalVariables?: Record<string, VariableRecord>;
  rem?: { light?: number; dark?: number };
  flags?: Record<string, unknown>;
};

export type StyleSheetRegisterOptions = {
  declarations?: Record<string, TransportStyle | TransportStyle[]>;
  keyframes?: Record<string, ExtractedAnimation>;
  rootVariables?: Record<string, VariableRecord>;
  universalVariables?: Record<string, VariableRecord>;
  rem?: { light?: number; dark?: number };
  flags?: Record<string, unknown>;
};

export type VariableRecord = Record<
  string,
  {
    darkApp?: RuntimeValueDescriptor;
    darkDevice?: RuntimeValueDescriptor;
    light?: RuntimeValueDescriptor;
  }
>;

export type Style = ViewStyle & TextStyle & ImageStyle;
export type StyleProp = Style | StyleProp[] | undefined;

export type CamelToKebabCase<
  T extends string,
  A extends string = "",
> = T extends `${infer F}${infer R}`
  ? CamelToKebabCase<
      R,
      `${A}${F extends Lowercase<F> ? "" : "-"}${Lowercase<F>}`
    >
  : A;

export type KebabToCamelCase<S extends string> =
  S extends `${infer P1}-${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${KebabToCamelCase<P3>}`
    : Lowercase<S>;

export interface ResetOptions {
  dimensions?: Dimensions;
  appearance?: typeof Appearance;
}

export type ExtractionWarning =
  | ExtractionWarningProperty
  | ExtractionWarningValue
  | ExtractionWarningFunctionValue;

export type ExtractionWarningProperty = {
  type: "IncompatibleNativeProperty";
  property: string;
};

export type ExtractionWarningValue = {
  type: "IncompatibleNativeValue";
  property: string;
  value: any;
};

export type ExtractionWarningFunctionValue = {
  type: "IncompatibleNativeFunctionValue";
  property: string;
  value: any;
};

export type DarkMode =
  | { type: "media" }
  | { type: "class"; value: string }
  | { type: "attribute"; value: string };

export interface CommonStyleSheet {
  [INTERNAL_RESET](options?: ResetOptions): void;
  [INTERNAL_FLAGS]: Record<string, string>;
  unstable_hook_onClassName?(c: string): void;
  register(options: StyleSheetRegisterOptions): void;
  registerCompiled(options: StyleSheetRegisterCompiledOptions): void;
  getFlag(name: string): string | undefined;
}

/*
 * This is a list of all the CSS properties that can be animated
 * Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
 */
export type AnimatableCSSProperty = (keyof Style | "fill" | "stroke") &
  KebabToCamelCase<
    | "background-color"
    | "border-bottom-color"
    | "border-bottom-left-radius"
    | "border-bottom-right-radius"
    | "border-bottom-width"
    | "border-color"
    | "border-left-color"
    | "border-left-width"
    | "border-radius"
    | "border-right-color"
    | "border-right-width"
    | "border-top-color"
    | "border-top-width"
    | "border-width"
    | "bottom"
    | "color"
    | "fill"
    | "flex"
    | "flex-basis"
    | "flex-grow"
    | "flex-shrink"
    | "font-size"
    | "font-weight"
    | "gap"
    | "height"
    | "left"
    | "letter-spacing"
    | "line-height"
    | "margin"
    | "margin-bottom"
    | "margin-left"
    | "margin-right"
    | "margin-top"
    | "max-height"
    | "max-width"
    | "min-height"
    | "min-width"
    | "object-position"
    | "opacity"
    | "order"
    | "padding"
    | "padding-bottom"
    | "padding-left"
    | "padding-right"
    | "padding-top"
    | "right"
    | "rotate"
    | "scale"
    | "stroke"
    | "text-decoration"
    | "text-decoration-color"
    | "top"
    | "transform"
    | "transform-origin"
    | "translate"
    | "vertical-align"
    | "visibility"
    | "width"
    | "word-spacing"
    | "z-index"
  >;
