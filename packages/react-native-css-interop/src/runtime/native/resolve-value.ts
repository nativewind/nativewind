import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";
import {
  AnimatableValue,
  Easing,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import type { EasingFunction, Time } from "lightningcss";
import type { RuntimeValueDescriptor, RuntimeValueFrame } from "../../types";
import type { PropStateObservable } from "./prop-state-observable";
import { rem, systemColorScheme, vh, vw } from "./globals";
import { Effect } from "../observable";
import { transformKeys } from "../../shared";

export function resolveValue(
  state: PropStateObservable,
  value: RuntimeValueDescriptor | string | number | boolean,
  style?: Record<string, any>,
): any {
  if (typeof value !== "object" || !value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => resolveValue(state, v, style));
  }

  if (!("name" in value)) return value;

  switch (value.name) {
    case "var": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "string"
        ? (state.getCSSVariable(descriptor, style) as any)
        : undefined;
    }
    case "vh": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? round((vh.get(state) / 100) * descriptor)
        : undefined;
    }
    case "vw": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? round((vw.get(state) / 100) * descriptor)
        : undefined;
    }
    case "em": {
      const descriptor = resolve(state, value.arguments[0], style);
      const fontSize = style?.fontSize ?? rem.get(state);
      return typeof descriptor === "number"
        ? round(fontSize * descriptor)
        : undefined;
    }
    case "rem": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? round(rem.get(state) * descriptor)
        : undefined;
    }
    case "rnh": {
      const descriptor = resolve(state, value.arguments[0], style);
      const height = style?.height ?? state.componentState.getLayout(state)[1];
      return typeof descriptor === "number"
        ? round(height * descriptor)
        : undefined;
    }
    case "rnw": {
      const descriptor = resolve(state, value.arguments[0], style);
      const width = style?.width ?? state.componentState.getLayout(state)[0];
      return typeof descriptor === "number"
        ? round(width * descriptor)
        : undefined;
    }
    case "rgb":
    case "rgba": {
      const args = resolve(state, value.arguments, style).flat(10);
      if (args.length === 3) {
        return `rgb(${args.join(", ")})`;
      } else if (args.length === 4) {
        return `rgba(${args.join(", ")})`;
      } else {
        return;
      }
    }
    case "hsla": {
      const args = resolve(state, value.arguments, style).flat(10);
      if (args.length === 3) {
        return `hsl(${args.join(" ")})`;
      } else if (args.length === 4) {
        return `hsla(${args.join(" ")})`;
      } else {
        return;
      }
    }
    case "hairlineWidth": {
      return StyleSheet.hairlineWidth;
    }
    case "platformColor": {
      return PlatformColor(...(value.arguments as any[])) as unknown as string;
    }
    case "platformSelect": {
      return resolve(state, Platform.select(value.arguments[0] as any), style);
    }
    case "getPixelSizeForLayoutSize": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? PixelRatio.getPixelSizeForLayoutSize(descriptor)
        : undefined;
    }
    case "fontScale": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? PixelRatio.getFontScale() * descriptor
        : undefined;
    }
    case "pixelScale": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? PixelRatio.get() * descriptor
        : undefined;
    }
    case "pixelScaleSelect": {
      const specifics = value.arguments[0] as any;
      return resolve(
        state,
        specifics[PixelRatio.get()] ?? specifics["default"],
        style,
      );
    }
    case "fontScaleSelect": {
      const specifics = value.arguments[0] as any;
      return resolve(
        state,
        specifics[PixelRatio.getFontScale()] ?? specifics["default"],
        style,
      );
    }
    case "roundToNearestPixel": {
      const descriptor = resolve(state, value.arguments[0], style);
      return typeof descriptor === "number"
        ? PixelRatio.roundToNearestPixel(descriptor)
        : undefined;
    }
    default: {
      const args = resolve(state, value.arguments, style).join(",");
      return `${value.name}(${args})`;
    }
  }
}

function resolve(
  state: PropStateObservable,
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

export function resolveAnimation(
  state: PropStateObservable,
  [initialFrame, ...frames]: RuntimeValueFrame[],
  property: string,
  props: Record<string, any> = {},
  normalizedProps: Record<string, any>,
  delay: number,
  totalDuration: number,
  timingFunction: EasingFunction,
): [AnimatableValue, AnimatableValue, ...AnimatableValue[]] {
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
            easing: getEasing(timingFunction),
          },
        ),
      );
    }),
  ] as [AnimatableValue, AnimatableValue, ...AnimatableValue[]];
}

function resolveAnimationValue(
  state: PropStateObservable,
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
        ? defaultValueFn(state)
        : defaultValueFn;
    }
    return value;
  } else {
    return resolve(state, value, props);
  }
}

export function resolveTransitionValue(
  state: PropStateObservable,
  props: Record<string, any> = {},
  normalizedProps: Record<string, any>,
  property: string,
) {
  const defaultValueFn = defaultValues[property];
  const defaultValue =
    typeof defaultValueFn === "function"
      ? defaultValueFn(state)
      : defaultValueFn;

  return {
    defaultValue,
    value: normalizedProps[property] ?? props[state.config.target][property],
  };
}

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

export function getEasing(timingFunction: EasingFunction) {
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
