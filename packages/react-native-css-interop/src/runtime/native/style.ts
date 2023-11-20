import { Signal, context, createSignal } from "../signals";
import {
  Specificity,
  ExtractedAnimations,
  ExtractedTransition,
  ExtractionWarning,
  ExtractedAnimation,
  GroupedTransportStyles,
  RuntimeValueDescriptor,
  RuntimeStyle,
  RuntimeValue,
  GroupedRuntimeStyle,
  TransportStyle,
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
import { STYLE_SCOPES, isPropDescriptor } from "../../shared";

export interface PropAccumulator {
  interop: InteropComputed;
  scope: number;
  animations?: Required<ExtractedAnimations>;
  transition?: Required<ExtractedTransition>;
  props: Record<string, any>;
  hoistedValues?: Record<string, Record<string, "transform" | "shadow">>;
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
  setVariable(name: string, value: any, specificity: Specificity): void;
}

export const styleSignals = new Map<string, Signal<GroupedRuntimeStyle>>();
export const opaqueStyles = new WeakMap<object, RuntimeStyle>();
export const animationMap = new Map<string, ExtractedAnimation>();

export const globalClassNameCache = new Map<string, PropAccumulator>();
export const globalInlineCache = new WeakMap<object, PropAccumulator>();

export const warnings = new Map<string, ExtractionWarning[]>();
export const warned = new Set<string>();

export function createPropAccumulator(interop: InteropComputed) {
  const acc: PropAccumulator = {
    interop,
    props: {},
    scope: STYLE_SCOPES.GLOBAL,
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
  };

  return acc;
}

export function upsertStyleSignal(
  name: string,
  groupedStyleMeta: GroupedTransportStyles,
) {
  const meta: GroupedRuntimeStyle = {
    scope: groupedStyleMeta.scope,
    [0]: groupedStyleMeta[0]?.map(mapStyle),
    [1]: groupedStyleMeta[1]?.map(mapStyle),
    [2]: groupedStyleMeta[2]?.map(mapStyle),
  };

  let signal = styleSignals.get(name);
  if (signal) {
    if (!deepEqual(signal.peek(), meta)) {
      signal.set(meta);
      if (process.env.NODE_ENV !== "production") {
        warned.delete(name);
        const originalGet = signal.get;
        signal.get = () => {
          printWarnings(name, groupedStyleMeta);
          return originalGet();
        };
      }
    }
  } else {
    let signal = styleSignals.get(name);

    if (signal) {
      signal.set(meta);
    } else {
      signal = createSignal(meta, name);
      if (process.env.NODE_ENV !== "production") {
        const originalGet = signal.get;
        signal.get = () => {
          printWarnings(name, groupedStyleMeta);
          return originalGet();
        };
      }

      styleSignals.set(name, signal);
    }
  }
}

function printWarnings(name: string, groupedStyleMeta: GroupedTransportStyles) {
  if (!groupedStyleMeta.warnings) return;

  for (const warning of groupedStyleMeta.warnings) {
    if (process.env.NODE_ENV === "test") {
      warnings.set(name, groupedStyleMeta.warnings);
    }

    warned.add(name);

    switch (warning.type) {
      case "IncompatibleNativeProperty":
        console.log("IncompatibleNativeProperty ", warning.property);
        break;
      case "IncompatibleNativeValue":
        console.log(
          "IncompatibleNativeValue ",
          warning.property,
          warning.value,
        );
        break;
      case "IncompatibleNativeFunctionValue":
        console.log(
          "IncompatibleNativeFunctionValue ",
          warning.property,
          warning.value,
        );
        break;
    }
  }
}

function mapStyle(style: TransportStyle): RuntimeStyle {
  return {
    ...style,
    $$type: "runtime",
    props: style.props?.map(([key, value]) => {
      if (isPropDescriptor(value)) {
        return [key, parseValue(value.value)];
      } else {
        return [
          key,
          Object.fromEntries(value.map(([k, v]) => [k, parseValue(v)])),
        ];
      }
    }),
  };
}

export function reduceStyles(
  acc: PropAccumulator,
  prop: string,
  styles: Array<RuntimeStyle | object>,
  _scope: number,
) {
  styles.sort(specificityCompare);

  for (let style of styles) {
    if (!("$$type" in style)) {
      acc.props[prop] ??= {};
      Object.assign(acc.props[prop], style);
      continue;
    }

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

    if (style.variables) {
      for (const [key, value] of style.variables) {
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

    if (style.props) {
      for (const [prop, value] of style.props) {
        if (typeof value === "object" && "$$type" in value) {
          acc.props[prop] = value.value;
        } else if (value !== undefined) {
          if (typeof value === "object") {
            acc.props[prop] ??= {};
            Object.assign(acc.props[prop], value);
          } else {
            acc.props[prop] = value;
          }
        }
      }
    }
  }

  return acc;
}

export function parseValue(
  value: RuntimeValueDescriptor | string | number,
): RuntimeValue {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (!("name" in value)) return value;

  switch (value.name) {
    case "var": {
      return function () {
        return getVariable(value.arguments[0]);
      };
    }
    case "vh": {
      return function () {
        return round((vh.get() / 100) * value.arguments[0]);
      };
    }
    case "vw": {
      return function () {
        return round((vw.get() / 100) * value.arguments[0]);
      };
    }
    case "em": {
      return function () {
        const style = getProp("style");
        if (style && typeof style.fontSize === "number") {
          return round(Number((style.fontSize || 0) * value.arguments[0]));
        }
      };
    }
    case "rem": {
      return function () {
        return round(globalVariables.rem.get() * value.arguments[0]);
      };
    }
    case "rnh": {
      return function () {
        return round(getDimensions("height") * value.arguments[0]);
      };
    }
    case "rnw": {
      return function () {
        return round(getDimensions("width") * value.arguments[0]);
      };
    }
    case "rgb":
    case "rgba": {
      return function () {
        const args = resolve(value.arguments);
        if (args.length === 3) {
          return `rgb(${args.join(", ")})`;
        } else if (args.length === 4) {
          return `rgba(${args.join(", ")})`;
        } else {
          return;
        }
      };
    }
    case "hsla": {
      return function () {
        const args = resolve(value.arguments);
        if (args.length === 3) {
          return `hsl(${args.join(" ")})`;
        } else if (args.length === 4) {
          return `hsla(${args.join(" ")})`;
        } else {
          return;
        }
      };
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }
    case "platformColor": {
      return PlatformColor(...value.arguments) as unknown as string;
    }
    case "platformSelect": {
      return function () {
        return resolve([Platform.select(value.arguments[0])]);
      };
    }
    case "getPixelSizeForLayoutSize": {
      return function () {
        return PixelRatio.getPixelSizeForLayoutSize(
          Number(resolve(value.arguments[0])),
        );
      };
    }
    case "fontScale": {
      return function () {
        return PixelRatio.getFontScale() * Number(resolve(value.arguments[0]));
      };
    }
    case "pixelScale": {
      return function () {
        return PixelRatio.get() * Number(resolve(value.arguments[0]));
      };
    }
    case "pixelScaleSelect": {
      return function () {
        const specifics = value.arguments[0];
        return resolve(specifics[PixelRatio.get()] ?? specifics["default"]);
      };
    }
    case "fontScaleSelect": {
      return function () {
        const specifics = value.arguments[0];
        return resolve(
          specifics[PixelRatio.getFontScale()] ?? specifics["default"],
        );
      };
    }
    case "roundToNearestPixel": {
      return function () {
        return PixelRatio.roundToNearestPixel(
          Number(resolve(value.arguments[0])),
        );
      };
    }
    default: {
      return function () {
        const args = resolve(value.arguments).join(",");
        return `${value.name}(${args})`;
      };
    }
  }
}

function resolve(
  args:
    | RuntimeValue
    | RuntimeValueDescriptor
    | Array<RuntimeValue | RuntimeValueDescriptor>,
): any {
  let resolved = [];
  if (args === undefined) return;
  if (Array.isArray(args)) {
    for (const arg of args) {
      resolved.push(resolve(arg));
    }
    resolved = resolved.flat(10);
    if (resolved.length === 0) {
      return;
    } else if (resolved.length === 1) {
      return resolved[0];
    } else {
      return resolved;
    }
  } else if (typeof args === "function") {
    return resolve(args());
  } else {
    const value = parseValue(args);
    if (value === undefined || Number.isNaN(value)) return;
    if (typeof value === "function") return resolve(value());
    return value;
  }
}

export function resolveAnimationValue(
  value: RuntimeValueDescriptor,
  prop: string,
  style: Record<string, any> = {},
) {
  if (value === "!INHERIT!") {
    return style[prop] ?? defaultValues[prop];
  } else if (value === "!INITIAL!") {
    return defaultValues[prop];
  } else {
    return resolve(value);
  }
}

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function specificityCompare(
  o1: object | RuntimeStyle,
  o2: object | RuntimeStyle,
) {
  // inline styles have no specificity and the order is preserved
  if (!("specificity" in o1) || !("specificity" in o2)) {
    return 0;
  }

  const a = o1.specificity;
  const b = o2.specificity;

  // We skip the inline & important, as we have already separated styles
  // into layers

  if (a.A !== b.A) {
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

function getProp(name: string): any {
  const current = context[context.length - 1]! as InteropComputed;
  return current.acc.props[name];
}

function getDimensions(
  dimension: "width" | "height" | "both",
  prop = "style",
): any {
  const current = context[context.length - 1]! as InteropComputed;
  const style = current.acc.props[prop];
  if (dimension === "width") {
    if (typeof style?.width === "number") {
      return style.width;
    } else {
      const layout = current.getLayout();
      current.acc.requiresLayoutWidth = true;
      return layout?.[0] ?? 0;
    }
  } else if (dimension === "height") {
    if (typeof style?.height === "number") {
      return style.height;
    } else {
      const layout = current.getLayout();
      current.acc.requiresLayoutHeight = true;
      return layout?.[1] ?? 0;
    }
  } else {
    let width = 0;
    let height = 0;
    if (typeof style?.width === "number") {
      width = style.width;
    } else {
      const layout = current.getLayout();
      current.acc.requiresLayoutWidth = true;
      width = layout?.[0] ?? 0;
    }
    if (typeof style?.height === "number") {
      height = style.height;
    } else {
      const layout = current.getLayout();
      current.acc.requiresLayoutHeight = true;
      height = layout?.[1] ?? 0;
    }
    return { width, height };
  }
}

function getVariable(name: any) {
  const current = context[context.length - 1]! as InteropComputed;
  return resolve(current.getVariable(name));
}

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
