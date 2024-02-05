import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";
import type { AnimatableValue } from "react-native-reanimated";
import type { EasingFunction, Time } from "lightningcss";
import type { RuntimeValueDescriptor, RuntimeValueFrame } from "../../types";
import { rem, systemColorScheme, universalVariables, vh, vw } from "./globals";
import { Effect } from "../observable";
import { transformKeys } from "../../shared";
import { PropState } from "./native-interop";
import { getWidth, getHeight } from "./utils";

export function resolveValue(
  state: PropState,
  descriptor: RuntimeValueDescriptor | string | number | boolean,
  style?: Record<string, any>,
): any {
  if (typeof descriptor !== "object" || !descriptor) return descriptor;

  if (Array.isArray(descriptor)) {
    return descriptor.map((v) => resolveValue(state, v, style));
  }

  switch (descriptor.name) {
    case "var": {
      const value = resolve(state, descriptor.arguments[0], style);
      if (typeof value === "string") return getVar(state, value, style);
    }
    case "vh": {
      const value = resolve(state, descriptor.arguments[0], style);
      const vhValue = vh.get(state.styleEffect) / 100;
      if (typeof value === "number") return round(vhValue * value);
    }
    case "vw": {
      const value = resolve(state, descriptor.arguments[0], style);
      const vwValue = vw.get(state.styleEffect) / 100;
      if (typeof value === "number") return round(vwValue * value);
    }
    case "em": {
      const value = resolve(state, descriptor.arguments[0], style);
      const fontSize = style?.fontSize ?? rem.get(state.styleEffect);
      if (typeof value === "number") return round(fontSize * value);
    }
    case "rem": {
      const value = resolve(state, descriptor.arguments[0], style);
      const remValue = rem.get(state.styleEffect);
      if (typeof value === "number") return round(remValue * value);
    }
    case "rnh": {
      const value = resolve(state, descriptor.arguments[0], style);
      const height = style?.height ?? getHeight(state);
      if (typeof value === "number") return round(height * value);
    }
    case "rnw": {
      const value = resolve(state, descriptor.arguments[0], style);
      const width = style?.width ?? getWidth(state);
      if (typeof value === "number") return round(width * value);
    }
    case "rgb":
    case "rgba": {
      const args = resolve(state, descriptor.arguments, style).flat(10);
      if (args.length === 3) return `rgb(${args.join(", ")})`;
      if (args.length === 4) return `rgba(${args.join(", ")})`;
    }
    case "hsla": {
      const args = resolve(state, descriptor.arguments, style).flat(10);
      if (args.length === 3) return `hsl(${args.join(" ")})`;
      if (args.length === 4) return `hsla(${args.join(" ")})`;
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }
    case "platformColor": {
      return PlatformColor(
        ...(descriptor.arguments as any[]),
      ) as unknown as string;
    }
    case "platformSelect": {
      return resolve(
        state,
        Platform.select(descriptor.arguments[0] as any),
        style,
      );
    }
    case "getPixelSizeForLayoutSize": {
      const v = resolve(state, descriptor.arguments[0], style);
      if (typeof v === "number") return PixelRatio.getPixelSizeForLayoutSize(v);
    }
    case "fontScale": {
      const value = resolve(state, descriptor.arguments[0], style);
      if (typeof value === "number") return PixelRatio.getFontScale() * value;
    }
    case "pixelScale": {
      const value = resolve(state, descriptor.arguments[0], style);
      if (typeof value === "number") return PixelRatio.get() * value;
    }
    case "pixelScaleSelect": {
      const specifics = descriptor.arguments[0] as any;
      return resolve(
        state,
        specifics[PixelRatio.get()] ?? specifics["default"],
        style,
      );
    }
    case "fontScaleSelect": {
      const specifics = descriptor.arguments[0] as any;
      return resolve(
        state,
        specifics[PixelRatio.getFontScale()] ?? specifics["default"],
        style,
      );
    }
    case "roundToNearestPixel": {
      const v = resolve(state, descriptor.arguments[0], style);
      if (typeof v === "number") return PixelRatio.roundToNearestPixel(v);
    }
    default: {
      if ("name" in descriptor && "arguments" in descriptor) {
        const args = resolve(state, descriptor.arguments, style).join(",");
        return `${descriptor.name}(${args})`;
      } else {
        return descriptor;
      }
    }
  }
}

function resolve(
  state: PropState,
  args: RuntimeValueDescriptor,
  style?: Record<string, any>,
): any {
  if (typeof args !== "object") {
    return args;
  }

  if (!Array.isArray(args)) {
    return "arguments" in args ? resolveValue(state, args, style) : args;
  }

  let resolved = [];

  for (let value of args) {
    value = resolve(state, value, style);

    if (value !== undefined) {
      resolved.push(value);
    }
  }

  return resolved;
}

function getVar(
  propState: PropState,
  name: string,
  style?: Record<string, any>,
) {
  if (!name) return;
  let value: any = undefined;
  value ??= propState.variables?.[name];
  value ??= universalVariables[name]?.get(propState.styleEffect);
  if (value === undefined) {
    value = propState.refs.variables[name];
    if (typeof value === "object" && "get" in value) {
      value = value.get(propState.styleEffect);
    }
    propState.variableTracking ??= new Map();
    propState.variableTracking.set(name, value);
  }
  return resolveValue(propState, value, style);
}

export function resolveAnimation(
  state: PropState,
  [initialFrame, ...frames]: RuntimeValueFrame[],
  property: string,
  props: Record<string, any> = {},
  normalizedProps: Record<string, any>,
  delay: number,
  totalDuration: number,
  timingFunction: EasingFunction,
): [AnimatableValue, AnimatableValue, ...AnimatableValue[]] {
  const { withDelay, withTiming, Easing } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  const initialValue = resolveAnimationValue(
    state,
    props,
    normalizedProps,
    property,
    initialFrame.value,
  );

  return [
    initialValue,
    ...frames.map((frame) => {
      return withDelay(
        delay,
        withTiming(
          resolveAnimationValue(
            state,
            props,
            normalizedProps,
            property,
            frame.value,
          ),
          {
            duration: totalDuration * frame.progress,
            easing: getEasing(timingFunction, Easing),
          },
        ),
      );
    }),
  ] as [AnimatableValue, AnimatableValue, ...AnimatableValue[]];
}

function resolveAnimationValue(
  state: PropState,
  props: Record<string, any> = {},
  normalizedProps: Record<string, any>,
  property: string,
  value: RuntimeValueDescriptor,
) {
  if (value === "!INHERIT!") {
    value = normalizedProps[property] ?? props.style[property];
    if (value === undefined) {
      const defaultValueFn = defaultValues[property];
      return typeof defaultValueFn === "function"
        ? defaultValueFn(state.styleEffect)
        : defaultValueFn;
    }
    return value;
  } else {
    return resolve(state, value, props);
  }
}

export function resolveTransitionValue(
  state: PropState,
  props: Record<string, any> = {},
  normalizedProps: Record<string, any>,
  property: string,
) {
  const defaultValueFn = defaultValues[property];
  const defaultValue =
    typeof defaultValueFn === "function"
      ? defaultValueFn(state.styleEffect)
      : defaultValueFn;

  return {
    defaultValue,
    value: normalizedProps[property] ?? props[state.target][property],
  };
}

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function getEasing(
  timingFunction: EasingFunction,
  Easing: typeof import("react-native-reanimated")["Easing"],
) {
  switch (timingFunction.type) {
    case "ease":
      return Easing.ease;
    case "ease-in":
      return Easing.in(Easing.quad);
    case "ease-out":
      return Easing.out(Easing.quad);
    case "ease-in-out":
      return Easing.inOut(Easing.quad);
    case "linear":
      return Easing.linear;
    case "cubic-bezier":
      return Easing.bezier(
        timingFunction.x1,
        timingFunction.y1,
        timingFunction.x2,
        timingFunction.y2,
      );
    default:
      return Easing.linear;
  }
}

export function setDeep(
  target: Record<string, any>,
  paths: string[],
  value: any,
) {
  const prop = paths[paths.length - 1];
  for (let i = 0; i < paths.length - 1; i++) {
    const token = paths[i];
    target[token] ??= {};
    target = target[token];
  }
  if (transformKeys.has(prop)) {
    if (target.transform) {
      const existing = target.transform.find(
        (t: any) => Object.keys(t)[0] === prop,
      );
      if (existing) {
        existing[prop] = value;
      } else {
        target.transform.push({ [prop]: value });
      }
    } else {
      target.transform ??= [];
      target.transform.push({ [prop]: value });
    }
  } else {
    target[prop] = value;
  }
}

export const defaultValues: Record<
  string,
  AnimatableValue | ((effect: Effect) => AnimatableValue)
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
  color: (effect) => {
    return systemColorScheme.get(effect) === "dark" ? "white" : "black";
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
