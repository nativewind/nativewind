import { Signal, createSignal } from "../signals";
import {
  ExtractedStyle,
  Specificity,
  ExtractedPropertyDescriptors,
  PropertyDescriptorValue,
  ExtractedAnimations,
  ExtractedTransition,
  ExtractedStyleFrame,
} from "../../types";
import {
  testContainerQuery,
  testMediaQueries,
  testPseudoClasses,
} from "./conditions";
import type { InteropComputed } from "./interop";
import { vh, vw } from "./misc";
import { globalVariables } from "./inheritance";
import { StyleSheet, Platform, PlatformColor } from "react-native";
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

const GetStyle = Symbol("CSSInteropGetStyle");
const GetVariable = Symbol("CSSInteropGetVariable");
const RunInEffect = Symbol("CSSInteropRunInEffect");

export const InlineSpecificity: Specificity = {
  A: 0,
  B: 0,
  C: 0,
  I: 0,
  S: 0,
  O: 0,
  inline: 1,
};

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
    getLayout: () => undefined,
    setVariable(name, value, specificity) {
      acc.variables[name] = value;
      acc.variablesSpecificity[name] = specificity;
      interop.setVariable(name, value);
    },
    [GetVariable](name) {
      return interop.runInEffect(() => {
        if (acc.variables[name] !== undefined) {
          const descriptor = parseValue(acc.variables[name]);

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

export const styleSignals = new Map<string, StyleSignal>();
export const opaqueStyles = new WeakMap<object, Pick<StyleSignal, "reducer">>();

export function upsertStyleSignal(name: string, styles: ExtractedStyle[]) {
  const mappedStyles: ExtractedPropertyDescriptors[] = styles.map((style) => {
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
    signal.set(mappedStyles);
  } else {
    styleSignals.set(name, createStyleSignal(name, mappedStyles));
  }
}

export function createStyleSignal(
  name: string,
  styles: ExtractedPropertyDescriptors[],
) {
  let signal = styleSignals.get(name);

  if (signal) {
    signal.set(styles);
  } else {
    signal = {
      ...createSignal<ExtractedPropertyDescriptors[]>(styles, name),
      reducer(acc, forceInline = false) {
        const extractedStyles = signal!.get();

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
      },
    };
  }

  return signal;
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
  value: PropertyDescriptorValue | string | number | Array<unknown>,
  primaryPropAcc?: PropAccumulator,
): PropertyDescriptor {
  if (typeof value === "number" || Array.isArray(value)) {
    return {
      value,
    };
  }

  if (typeof value === "string") {
    if (value.includes(" ")) {
      return {
        value: value.split(" "),
      };
    } else {
      return {
        value,
      };
    }
  }

  if (!("name" in value)) return value;

  switch (value.name) {
    case "var": {
      return {
        get: function (primaryPropAcc?: PropAccumulator) {
          return getPropAccumulator(this, primaryPropAcc)[GetVariable](
            value.arguments[0] as string,
          );
        },
      };
    }
    case "vh": {
      return {
        get: function () {
          return runInEffect(this, primaryPropAcc, () => {
            return round((vh.get() / 100) * (value.arguments[0] as number));
          });
        },
      };
    }
    case "vw": {
      return {
        get: function () {
          return runInEffect(this, primaryPropAcc, () => {
            return round((vw.get() / 100) * (value.arguments[0] as number));
          });
        },
      };
    }
    case "em": {
      return {
        get: function () {
          const style = getStyle(this);
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
          return runInEffect(this, primaryPropAcc, () => {
            return round(
              globalVariables.rem.get() * (value.arguments[0] as number),
            );
          });
        },
      };
    }
    case "rnh": {
      return {
        get: function () {
          const acc = getPropAccumulator(this, primaryPropAcc);
          const style = getStyle(this);

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
      return {
        get: function () {
          const acc = getPropAccumulator(this, primaryPropAcc);
          const style = getStyle(this);

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
    case "hsla": {
      return {
        get: function () {
          const args = resolveRuntimeArgs(
            value.arguments,
            getPropAccumulator(this, primaryPropAcc),
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
      return {
        value: StyleSheet.hairlineWidth,
      };
    }
    case "platformColor": {
      return {
        value: PlatformColor(...value.arguments),
      };
    }
    case "platformSelect": {
      return {
        get: function () {
          debugger;
          return resolveRuntimeArgs(
            [Platform.select(value.arguments[0])],
            getPropAccumulator(this, primaryPropAcc),
          );
        },
      };
    }
    default: {
      return {
        value: undefined,
      };
    }
  }
}

function resolveRuntimeArgs(args: any, acc: PropAccumulator): any {
  let resolved = [];
  if (Array.isArray(args)) {
    for (const arg of args) {
      resolved.push(resolveRuntimeArgs(arg, acc));
    }
  } else {
    const descriptor = parseValue(args, acc);

    if (descriptor) {
      if (descriptor.value !== undefined) {
        resolved.push(descriptor.value);
      } else {
        const value = (descriptor.get as any)?.(acc);
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
  frame: ExtractedStyleFrame,
  prop: string,
  style: Record<string, any>,
  acc: PropAccumulator,
) {
  return frame.value === "!INHERIT!"
    ? style[prop] ?? defaultValues[prop]
    : frame.value === "!INITIAL!"
    ? defaultValues[prop]
    : resolveRuntimeArgs(frame.value, acc);
}

function getStyle(source: unknown) {
  if (source && typeof source === "object" && GetStyle in source) {
    const style = (source as any)[GetStyle]();
    if (style && typeof style === "object") {
      return style as Record<string, any>;
    }
  }
}

function runInEffect(
  source: unknown,
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

const defaultAnimation: Required<ExtractedAnimations> = {
  direction: ["normal"],
  fillMode: ["none"],
  iterationCount: [{ type: "number", value: 1 }],
  timingFunction: [{ type: "linear" }],
  name: [],
  playState: ["running"],
  duration: [
    {
      type: "seconds",
      value: 0,
    },
  ],
  delay: [
    {
      type: "seconds",
      value: 0,
    },
  ],
};

const defaultTransition: Required<ExtractedTransition> = {
  property: [],
  duration: [
    {
      type: "seconds",
      value: 0,
    },
  ],
  delay: [
    {
      type: "seconds",
      value: 0,
    },
  ],
  timingFunction: [{ type: "linear" }],
};

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

export function extractAnimationValue(
  frame: ExtractedStyleFrame,
  prop: string,
  style: Record<string, any>,
  meta: any,
  interop: InteropComputed,
) {
  let value =
    frame.value === "!INHERIT!"
      ? style[prop] ?? defaultValues[prop]
      : frame.value === "!INITIAL!"
      ? defaultValues[prop]
      : undefined; // parseValue(frame.value, style, meta, interop);

  return typeof value === "function" ? value() : value;
}
