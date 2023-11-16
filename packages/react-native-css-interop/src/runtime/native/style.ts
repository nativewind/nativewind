import { Signal, createSignal } from "../signals";
import {
  ExtractedStyle,
  Specificity,
  ExtractedPropertyDescriptors,
  DescriptorOrRuntimeValue,
  ExtractedAnimations,
  ExtractedTransition,
  ExtractionWarning,
  ExtractedAnimation,
} from "../../types";
import {
  testContainerQuery,
  testMediaQueries,
  testPseudoClasses,
} from "./conditions";
import type { InteropComputed } from "./interop";
import { vh, vw } from "./misc";
import { globalVariables } from "./inheritance";
import { StyleSheet, Platform, PlatformColor, PixelRatio } from "react-native";
import { AnimatableValue } from "react-native-reanimated";
import { colorScheme } from "./color-scheme";
import { Time } from "lightningcss";

export interface PropAccumulator {
  interop: InteropComputed;
  animations?: Required<ExtractedAnimations>;
  transition?: Required<ExtractedTransition>;
  props: Record<string, any>;
  propsSpecificity: Record<string, Record<string, Specificity | undefined>>;
  variables: Record<string, any>;
  variablesSpecificity: Record<string, Specificity>;
  hasActive: boolean;
  hasHover: boolean;
  hasFocus: boolean;
  hasContainer: boolean;
  forceContext: boolean;
  requiresLayoutWidth: boolean;
  requiresLayoutHeight: boolean;
  getLayout: () => [number, number] | undefined;
  [GetVariable](name: string): string | number;
  setVariable(name: string, value: any, specificity: Specificity): void;
  [RunInEffect]: (fn: () => any) => any;
}

export const styleSignals = new Map<string, StyleSignal>();
export const opaqueStyles = new WeakMap<object, Pick<StyleSignal, "reducer">>();
export const animationMap = new Map<string, ExtractedAnimation>();

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

const GetStyle = Symbol("CSSInteropGetStyle");
const GetVariable = Symbol("CSSInteropGetVariable");
const RunInEffect = Symbol("CSSInteropRunInEffect");

export function createPropAccumulator(interop: InteropComputed) {
  const acc: PropAccumulator = {
    interop,
    props: {},
    propsSpecificity: {},
    variables: {},
    variablesSpecificity: {},
    hasActive: false,
    hasFocus: false,
    hasHover: false,
    hasContainer: false,
    forceContext: false,
    requiresLayoutWidth: false,
    requiresLayoutHeight: false,
    getLayout: interop.getLayout,
    setVariable(name, value, specificity) {
      acc.variables[name] = value;
      acc.variablesSpecificity[name] = specificity;
      interop.setVariable(name, value);
    },
    [GetVariable](name) {
      return interop.runInEffect(() => {
        if (acc.variables[name] !== undefined) {
          const descriptor = parseValue(acc.variables[name], acc);

          if (!descriptor) {
          } else if ("value" in descriptor) {
            return descriptor.value;
          } else {
            return descriptor.get?.();
          }
        } else {
          return interop.getVariable(name);
        }
      });
    },
    [RunInEffect]: interop.runInEffect,
  };

  return acc;
}

interface StyleSignal extends Signal<ExtractedPropertyDescriptors[]> {
  reducer: (acc: PropAccumulator, forceInline?: boolean) => PropAccumulator;
}

export function upsertStyleSignal(name: string, styles: ExtractedStyle[]) {
  const mappedStyles: ExtractedPropertyDescriptors[] = styles.map((style) => {
    if (process.env.NODE_ENV !== "production") {
      if (style.warnings) {
        warnings.set(name, style.warnings);
      }
    }

    return {
      ...style,
      entries: style.entries?.map(([key, value]) => {
        return [
          key,
          Array.isArray(value)
            ? value.map(([k, v]) => [k, parseValue(v)])
            : parseValue(value),
        ];
      }),
    };
  });

  let signal = styleSignals.get(name);
  if (signal) {
    if (!deepEqual(signal.get(), mappedStyles)) {
      warned.delete(name);
      signal.set(mappedStyles);
    }
  } else {
    let signal = styleSignals.get(name);

    if (signal) {
      signal.set(mappedStyles);
    } else {
      signal = {
        ...createSignal<ExtractedPropertyDescriptors[]>(mappedStyles, name),
        reducer(acc, forceInline = false) {
          if (process.env.NODE_ENV !== "production") {
            if (warnings.has(name)) {
              if (process.env.NODE_ENV !== "test") {
                console.log(warnings.get(name));
                warnings.delete(name);
              }
              warned.add(name);
            }
          }

          const extractedStyles = signal!.get();
          return reduceClassNameStyle(acc, extractedStyles, forceInline);
        },
      };
    }
    styleSignals.set(name, signal);
  }
}

export function reduceClassNameStyle(
  acc: PropAccumulator,
  extractedStyles: ExtractedPropertyDescriptors[],
  forceInline = false,
) {
  for (const style of extractedStyles) {
    if (style.variables || style.container?.names) {
      acc.forceContext = true;
    }

    if (style.pseudoClasses) {
      acc.hasActive ||= Boolean(style.pseudoClasses.active);
      acc.hasHover ||= Boolean(style.pseudoClasses.hover);
      acc.hasFocus ||= Boolean(style.pseudoClasses.focus);
      if (!testPseudoClasses(acc.interop, style.pseudoClasses)) {
        continue;
      }
    }

    if (style.media && !testMediaQueries(style.media)) {
      continue;
    }

    if (
      style.containerQuery &&
      !testContainerQuery(style.containerQuery, acc.interop)
    ) {
      continue;
    }

    const styleSpecificity: Specificity = forceInline
      ? {
          ...style.specificity,
          inline: 1,
        }
      : style.specificity;

    if (style.variables) {
      for (const [key, value] of style.variables) {
        const specificity = acc.variablesSpecificity[key];

        if (hasLowerSpecificity(specificity, styleSpecificity)) {
          continue;
        }

        acc.setVariable(key, value, style.specificity);
      }
    }

    if (style.animations) {
      acc.animations = {
        ...defaultAnimation,
        ...acc.animations,
        ...style.animations,
      };
    }

    if (style.transition) {
      acc.transition = {
        ...defaultTransition,
        ...acc.transition,
        ...style.transition,
      };
    }

    if (style.container?.names) {
      acc.requiresLayoutWidth = true;
      acc.requiresLayoutHeight = true;
      acc.hasContainer = true;
      for (const name of style.container.names) {
        acc.interop.setContainer(name);
      }
    }

    if (style.entries) {
      for (const [prop, styleEntriesOrValue] of style.entries) {
        acc.propsSpecificity[prop] ??= {};

        if (Array.isArray(styleEntriesOrValue)) {
          for (let [key, value] of styleEntriesOrValue) {
            const specificity =
              acc.propsSpecificity[prop]["__prop"] ??
              acc.propsSpecificity[prop][key];

            if (hasLowerSpecificity(specificity, styleSpecificity)) {
              continue;
            }

            acc.propsSpecificity[prop][key] = style.specificity;
            acc.propsSpecificity[prop]["__prop"] = undefined;
            acc.props[prop] ??= {
              [GetStyle]: () => acc.props[prop],
              [GetVariable]: acc[GetVariable],
              [RunInEffect]: acc[RunInEffect],
            };

            let object = acc.props[prop];

            if (key.includes(".")) {
              const [left, right] = key.split(".");
              object[left] ??= {};
              object = object[left];
              key = right;
            }

            Object.defineProperty(object, key, {
              configurable: true,
              enumerable: true,
              ...value,
            });
          }
        } else {
          const specificity = acc.propsSpecificity[prop]["__prop"];

          if (hasLowerSpecificity(specificity, styleSpecificity)) {
            continue;
          }

          acc.propsSpecificity[prop]["__prop"] = style.specificity;
          Object.defineProperty(acc.props, prop, {
            configurable: true,
            enumerable: true,
            ...styleEntriesOrValue,
          });
        }
      }
    }
  }

  return acc;
}

export function reduceOpaqueStyle(
  acc: PropAccumulator,
  variables: Record<string, string | number>,
) {
  for (let [key, value] of Object.entries(variables)) {
    if (!key.startsWith("--")) {
      key = `--${key}`;
    }

    const specificity = acc.variablesSpecificity[key];

    if (hasLowerSpecificity(specificity, InlineSpecificity)) {
      continue;
    }

    acc.setVariable(key, value, InlineSpecificity);
  }

  return acc;
}

export function reduceInlineStyle(
  acc: PropAccumulator,
  prop: string,
  style: unknown,
): PropAccumulator {
  if (typeof style !== "object" || !style) return acc;

  const opaqueStyle = opaqueStyles.get(style);

  if (opaqueStyle) {
    return opaqueStyle.reducer(acc);
  } else if (Array.isArray(style)) {
    return style.reduce(
      (acc, style) => reduceInlineStyle(acc, prop, style),
      acc,
    );
  } else {
    acc.props[prop] ??= {
      [GetStyle]: () => acc.props[prop],
      [GetVariable]: acc[GetVariable],
      [RunInEffect]: acc[RunInEffect],
    };
    for (const [key, value] of Object.entries(style)) {
      acc.propsSpecificity[prop] ??= {};

      const specificity =
        acc.propsSpecificity[prop]["__prop"] ?? acc.propsSpecificity[prop][key];

      if (hasLowerSpecificity(specificity, InlineSpecificity)) {
        continue;
      }

      if (prop === "transform") {
        for (const transform of value) {
          const [key, value] = Object.entries(transform)[0];
          acc.propsSpecificity[prop][`transform.${key}`] = InlineSpecificity;

          Object.defineProperty(acc.props[prop], key, {
            configurable: true,
            enumerable: true,
            value,
          });
        }
      } else {
        if (typeof value === "object") {
          // value could be null
          for (const key of Object.keys(value ?? {})) {
            acc.propsSpecificity[prop][`${prop}.${key}`] = InlineSpecificity;
          }
        } else {
          acc.propsSpecificity[prop][key] = InlineSpecificity;
        }
        Object.defineProperty(acc.props[prop], key, {
          configurable: true,
          enumerable: true,
          value,
        });
      }
    }
  }

  return acc;
}

export function parseValue(
  value: DescriptorOrRuntimeValue | string | number | Array<unknown>,
  acc?: PropAccumulator,
  primaryStyle?: Record<string, any>,
): PropertyDescriptor {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    Array.isArray(value)
  ) {
    return { value };
  }

  if (!("name" in value)) return value;

  switch (value.name) {
    case "var": {
      return {
        get: function () {
          return getPropAccumulator(this, acc)[GetVariable](
            value.arguments[0] as string,
          );
        },
      };
    }
    case "vh": {
      return {
        get: function () {
          return runInEffect(this, acc, () => {
            return round((vh.get() / 100) * (value.arguments[0] as number));
          });
        },
      };
    }
    case "vw": {
      return {
        get: function () {
          return runInEffect(this, acc, () => {
            return round((vw.get() / 100) * (value.arguments[0] as number));
          });
        },
      };
    }
    case "em": {
      return {
        get: function () {
          const style = getStyle(this, primaryStyle);
          if (style && "fontSize" in style) {
            return round(
              ((style.fontSize || 0) * value.arguments[0]) as number,
            );
          }
        },
      };
    }
    case "rem": {
      return {
        get: function () {
          return runInEffect(this, acc, () => {
            return round(
              globalVariables.rem.get() * (value.arguments[0] as number),
            );
          });
        },
      };
    }
    case "rnh": {
      if (acc) acc.requiresLayoutHeight = true;
      return {
        get: function () {
          acc = getPropAccumulator(this, acc);
          const style = getStyle(this, primaryStyle);

          let ref = 0;
          if (typeof style?.height === "number") {
            ref = style.height;
          } else {
            const layout = acc.getLayout();
            if (layout) {
              ref = layout[1];
            }
          }

          return round((ref * value.arguments[0]) as number);
        },
      };
    }
    case "rnw": {
      if (acc) acc.requiresLayoutWidth = true;
      return {
        get: function () {
          acc = getPropAccumulator(this, acc);
          const style = getStyle(this, primaryStyle);

          let ref = 0;
          if (typeof style?.width === "number") {
            ref = style.width;
          } else {
            const layout = acc.getLayout();
            if (layout) {
              ref = layout[0];
            }
          }

          return round((ref * value.arguments[0]) as number);
        },
      };
    }
    case "rgb":
    case "rgba": {
      return {
        get: function () {
          const args = resolveRuntimeArgs(
            value.arguments,
            getPropAccumulator(this, acc),
          );
          if (args.length === 3) {
            return `rgb(${args.join(", ")})`;
          } else if (args.length === 4) {
            return `rgba(${args.join(", ")})`;
          } else {
            return;
          }
        },
      };
    }
    case "hsla": {
      return {
        get: function () {
          const args = resolveRuntimeArgs(
            value.arguments,
            getPropAccumulator(this, acc),
          );
          if (args.length === 3) {
            return `hsl(${args.join(" ")})`;
          } else if (args.length === 4) {
            return `hsla(${args.join(" ")})`;
          } else {
            return;
          }
        },
      };
    }
    case "hairlineWidth": {
      return { value: StyleSheet.hairlineWidth };
    }
    case "platformColor": {
      return { value: PlatformColor(...value.arguments) };
    }
    case "platformSelect": {
      return {
        get: function () {
          return resolveRuntimeArgs(
            [Platform.select(value.arguments[0])],
            getPropAccumulator(this, acc),
          );
        },
      };
    }
    case "getPixelSizeForLayoutSize": {
      return {
        get: function () {
          return PixelRatio.getPixelSizeForLayoutSize(
            resolveRuntimeArgs(
              value.arguments[0],
              getPropAccumulator(this, acc),
            ),
          );
        },
      };
    }
    case "fontScale": {
      return {
        get: function () {
          return (
            PixelRatio.getFontScale() *
            Number(
              resolveRuntimeArgs(
                value.arguments[0],
                getPropAccumulator(this, acc),
              ),
            )
          );
        },
      };
    }
    case "pixelScale": {
      return {
        get: function () {
          return (
            PixelRatio.get() *
            Number(
              resolveRuntimeArgs(
                value.arguments[0],
                getPropAccumulator(this, acc),
              ),
            )
          );
        },
      };
    }
    case "pixelScaleSelect": {
      return {
        get: function () {
          const specifics = value.arguments[0];
          return resolveRuntimeArgs(
            specifics[PixelRatio.get()] ?? specifics["default"],
            getPropAccumulator(this, acc),
          );
        },
      };
    }
    case "fontScaleSelect": {
      return {
        get: function () {
          const specifics = value.arguments[0];
          return resolveRuntimeArgs(
            specifics[PixelRatio.getFontScale()] ?? specifics["default"],
            getPropAccumulator(this, acc),
          );
        },
      };
    }
    case "roundToNearestPixel": {
      return {
        get: function () {
          return PixelRatio.roundToNearestPixel(
            resolveRuntimeArgs(
              value.arguments[0],
              getPropAccumulator(this, acc),
            ),
          );
        },
      };
    }
    default: {
      return {
        get: function () {
          const args = resolveRuntimeArgs(
            value.arguments,
            getPropAccumulator(this, acc),
          );

          return `${value.name}(${args.join(",")})`;
        },
      };
    }
  }
}

function resolveRuntimeArgs(
  args: any,
  acc: PropAccumulator,
  style?: Record<string, any>,
): any {
  let resolved = [];
  if (args === undefined) return;
  if (Array.isArray(args)) {
    for (const arg of args) {
      resolved.push(resolveRuntimeArgs(arg, acc));
    }
  } else {
    const descriptor = parseValue(args, acc, style);

    if (descriptor) {
      if (descriptor.value !== undefined) {
        resolved.push(descriptor.value);
      } else {
        const value = (descriptor.get as any)?.();
        if (value !== undefined) {
          resolved.push(value);
        }
      }
    }
  }

  resolved = resolved.flat(10);

  if (resolved.length === 0) {
    return;
  } else if (resolved.length === 1) {
    return resolved[0];
  } else {
    return resolved;
  }
}

export function resolveAnimationValue(
  frame: DescriptorOrRuntimeValue,
  prop: string,
  acc: PropAccumulator,
  style: Record<string, any> = {},
) {
  if ("value" in frame) {
    if (frame.value === "!INHERIT!") {
      return style[prop] ?? defaultValues[prop];
    } else if (frame.value === "!INITIAL!") {
      return defaultValues[prop];
    }
  }

  return resolveRuntimeArgs(frame, acc, style);
}

function getStyle(source: unknown, primaryStyle?: Record<string, any>) {
  if (primaryStyle) return primaryStyle;

  if (source && typeof source === "object" && GetStyle in source) {
    const style = (source as any)[GetStyle]();
    if (style && typeof style === "object") {
      return style as Record<string, any>;
    }
  }
}

function runInEffect(
  source: any,
  primary: PropAccumulator | undefined,
  fn: () => any,
) {
  return ((primary ?? source) as PropAccumulator)[RunInEffect](fn);
}

function getPropAccumulator(source: unknown, primary?: PropAccumulator) {
  return (primary ?? source) as PropAccumulator;
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

function hasLowerSpecificity(a: Specificity | undefined, b: Specificity) {
  if (!a) return false;
  return specificityCompare(a, b) === 1;
}

const InlineSpecificity: Specificity = {
  A: 0,
  B: 0,
  C: 0,
  I: 0,
  S: 0,
  O: 0,
  inline: 1,
};

export function specificityCompare(a: Specificity, b: Specificity) {
  // Important first
  if (a.I !== b.I) {
    return a.I - b.I;
  } else if (a.inline !== b.inline) {
    return (a.inline || 0) - (b.inline || 0);
  } else if (a.A !== b.A) {
    // Ids
    return a.A - b.A;
  } else if (a.B !== b.B) {
    // Classes
    return a.B - b.B;
  } else if (a.C !== b.C) {
    // Styles
    return a.C - b.C;
  } else if (a.S !== b.S) {
    // StyleSheet Order
    return a.S - b.S;
  } else if (a.O !== b.O) {
    // Appearance Order
    return a.O - b.O;
  } else {
    // They are the same
    return 0;
  }
}

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

const defaultAnimation: Required<ExtractedAnimations> = {
  name: [],
  direction: ["normal"],
  fillMode: ["none"],
  iterationCount: [{ type: "number", value: 1 }],
  timingFunction: [{ type: "linear" }],
  playState: ["running"],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
};

const defaultTransition: Required<ExtractedTransition> = {
  property: [],
  duration: [{ type: "seconds", value: 0 }],
  delay: [{ type: "seconds", value: 0 }],
  timingFunction: [{ type: "linear" }],
};

export const defaultValues: Record<
  string,
  AnimatableValue | (() => AnimatableValue)
> = {
  backgroundColor: "transparent",
  borderBottomColor: "transparent",
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderBottomWidth: 0,
  borderColor: "transparent",
  borderLeftColor: "transparent",
  borderLeftWidth: 0,
  borderRadius: 0,
  borderRightColor: "transparent",
  borderRightWidth: 0,
  borderTopColor: "transparent",
  borderTopWidth: 0,
  borderWidth: 0,
  bottom: 0,
  color: () => {
    return colorScheme.get() === "dark" ? "white" : "black";
  },
  flex: 1,
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 0,
  fontSize: 14,
  fontWeight: "400",
  gap: 0,
  left: 0,
  lineHeight: 14,
  margin: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0,
  maxHeight: 99999,
  maxWidth: 99999,
  minHeight: 0,
  minWidth: 0,
  opacity: 1,
  padding: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  perspective: 1,
  right: 0,
  rotate: "0deg",
  rotateX: "0deg",
  rotateY: "0deg",
  rotateZ: "0deg",
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  skewX: "0deg",
  skewY: "0deg",
  top: 0,
  translateX: 0,
  translateY: 0,
  zIndex: 0,
};

function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2)
    // it's just the same object. No need to compare.
    return true;

  if (isPrimitive(obj1) && isPrimitive(obj2))
    // compare primitives
    return obj1 === obj2;

  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

  // compare objects with same number of keys
  for (let key in obj1) {
    if (!(key in obj2)) return false; //other object doesn't have this prop
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

//check if value is primitive
function isPrimitive(obj: any) {
  return obj !== Object(obj);
}
