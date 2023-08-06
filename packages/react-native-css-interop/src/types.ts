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
  Appearance,
  Dimensions,
  ImageStyle,
  MatrixTransform,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TextStyle,
  TranslateXTransform,
  TranslateYTransform,
  ViewStyle,
} from "react-native";
import {
  DarkMode,
  DevHotReloadSubscription,
  INTERNAL_VERIFICATION_FLAGS,
  INTERNAL_RESET,
} from "./shared";
import { ComponentType } from "react";

export interface ExtractRuleOptions {
  platform?: string;
  declarations: Map<string, ExtractedStyle | ExtractedStyle[]>;
  keyframes: Map<string, ExtractedAnimation>;
  grouping: RegExp[];
  darkMode?: DarkMode;
  rootVariables: StyleSheetRegisterOptions["rootVariables"];
  rootDarkVariables: StyleSheetRegisterOptions["rootDarkVariables"];
  defaultVariables: StyleSheetRegisterOptions["defaultVariables"];
  defaultDarkVariables: StyleSheetRegisterOptions["defaultDarkVariables"];
  verify: Record<string, unknown>;
}

declare global {
  var window: Record<string, any>;
}

export type EnableCssInteropOptions<P> = {
  [K in string]?: CSSInteropClassNamePropConfig<P>;
};

export type CSSInteropClassNamePropConfig<P> =
  | undefined
  | (keyof P & string)
  | boolean
  | {
      target: (keyof P & string) | boolean;
      nativeStyleToProp: NativeStyleToProp<P>;
    };

export type NativeStyleToProp<P> = {
  [K in keyof Style & string]?: K extends keyof P ? keyof P | true : keyof P;
};

export type RemapClassNamePropsOptions<P> = {
  [K in string]?: (keyof P & string) | true | undefined;
};

export type ComponentTypeWithMapping<P, M> = ComponentType<
  P & { [K in keyof M]?: string }
>;

export type JSXFunction<P> = (type: any, props: P, key?: string) => any;

export type BasicInteropFunction = <P>(
  jsx: JSXFunction<P>,
  type: any,
  props: P,
  key: string | undefined,
) => any;

export type InteropFunction = <P>(
  jsx: JSXFunction<P>,
  type: any,
  props: P,
  key: string | undefined,
  options: InteropFunctionOptions<P>,
) => any;

export type InteropFunctionOptions<P> = {
  remappedProps: P;
  configMap: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>;
  dependencies: unknown[];
  hasMeta: boolean;
};

export type RuntimeValue = {
  type: "runtime";
  name: string;
  arguments: any[];
};

export type ExtractedStyleValue =
  | string
  | number
  | RuntimeValue
  | ExtractedStyleValue[];

export type ExtractedStyle = {
  isDynamic?: boolean;
  media?: MediaQuery[];
  variables?: Record<string, ExtractedStyleValue>;
  prop?: [string, string | true];
  style: Record<string, ExtractedStyleValue>;
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: Partial<ExtractedContainer>;
  containerQuery?: ExtractedContainerQuery[];
  transition?: ExtractedTransition;
  requiresLayout?: boolean;
  warnings?: ExtractionWarning[];
};

export type PropInteropMeta = {
  variables?: Record<string, unknown>;
  containers?: string[];
  animated: boolean;
  transition: boolean;
  requiresLayout: boolean;
  hasActive?: boolean;
  hasHover?: boolean;
  hasFocus?: boolean;
};

export type StyleMeta = {
  variableProps?: Set<string>;
  media?: MediaQuery[];
  variables?: Record<string, unknown>;
  pseudoClasses?: PseudoClassesQuery;
  animations?: ExtractedAnimations;
  container?: ExtractedContainer;
  containerQuery?: ExtractedContainerQuery[];
  transition?: ExtractedTransition;
  requiresLayout?: boolean;
};

export interface SignalLike<T = unknown> {
  get(): T;
}

export interface Signal<T = unknown> {
  get(): T;
  snapshot(): T;
  set(value: T): void;
  stale(change: 1 | -1, fresh: boolean): void;
  subscribe(callback: () => void): () => void;
}

export type InteropMeta = {
  animatedProps: Set<string>;
  animationInteropKey?: string;
  containers: Record<string, ContainerRuntime>;
  convertToPressable: boolean;
  hasInlineContainers: boolean;
  hasInlineVariables: boolean;
  inheritedContainers: Record<string, ContainerRuntime>;
  interaction: Interaction;
  transitionProps: Set<string>;
  requiresLayout: boolean;
  variables: Record<string, unknown>;
};

export type Interaction = {
  active: Signal<boolean>;
  hover: Signal<boolean>;
  focus: Signal<boolean>;
  layout: {
    width: Signal<number>;
    height: Signal<number>;
  };
};

export type ExtractedContainer = {
  names?: string[] | false;
  type: ContainerType;
};

export type ContainerRuntime = {
  type: ContainerType;
  interaction: Interaction;
  style: Style;
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
  frames: ExtractedKeyframe[];
  requiresLayout?: boolean;
};

export type ExtractedKeyframe = {
  selector: number;
  style: Record<string, ExtractedStyleValue>;
};

export type PseudoClassesQuery = {
  hover?: boolean;
  active?: boolean;
  focus?: boolean;
};

export type StyleSheetRegisterOptions = {
  declarations?: Record<string, ExtractedStyle | ExtractedStyle[]>;
  keyframes?: Record<string, ExtractedAnimation>;
  rootVariables?: Record<string, ExtractedStyleValue>;
  rootDarkVariables?: Record<string, ExtractedStyleValue>;
  defaultVariables?: Record<string, ExtractedStyleValue>;
  defaultDarkVariables?: Record<string, ExtractedStyleValue>;
  colorSchemeClass?: string;
  darkMode?: DarkMode;
  verify?: Record<string, unknown>;
};

export type Style = ViewStyle & TextStyle & ImageStyle;
export type StyleProp = Style | StyleProp[] | undefined;

export type NamedStyles<T> = {
  [P in keyof T]: StyleProp;
};

export type TransformRecord = Partial<
  PerpectiveTransform &
    RotateTransform &
    RotateXTransform &
    RotateYTransform &
    RotateZTransform &
    ScaleTransform &
    ScaleXTransform &
    ScaleYTransform &
    TranslateXTransform &
    TranslateYTransform &
    SkewXTransform &
    SkewYTransform &
    MatrixTransform
>;

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
  [INTERNAL_VERIFICATION_FLAGS]: Record<string, unknown>;
  [DevHotReloadSubscription](subscription: () => void): () => void;
  classNameMergeStrategy(c: string): string;
  register(options: StyleSheetRegisterOptions): void;
  /**
   * Internal flag to signal if web should use a className to set Dark Mode.
   */
  [DarkMode]: DarkMode;
  setColorScheme(colorScheme: "light" | "dark" | "system"): void;
  setDarkMode(type: CommonStyleSheet[typeof DarkMode]): void;
  setRem(value: number): void;
  getRem(value: number): void;
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
