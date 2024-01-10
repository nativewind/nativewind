import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";
import {
  AnimatableValue,
  Easing,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { EasingFunction, Time } from "lightningcss";
import {
  RuntimeValue,
  RuntimeValueDescriptor,
  RuntimeValueFrame,
} from "../../types";
import { interopGlobal } from "../signals";
import type { PropStateEffect } from "./prop-state";
import { colorScheme, rem, vh, vw } from "./globals";

export function resolve(
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

export function resolveAnimation(
  [initialFrame, ...frames]: RuntimeValueFrame[],
  prop: string,
  props: Record<string, any>,
  delay: number,
  totalDuration: number,
  timingFunction: EasingFunction,
): [AnimatableValue, AnimatableValue, ...AnimatableValue[]] {
  const initialValue = resolveAnimationValue(
    initialFrame.value,
    prop,
    props.style,
  );

  return [
    initialValue,
    ...frames.map((frame) => {
      return withDelay(
        delay,
        withTiming(resolveAnimationValue(frame.value, prop, props.style), {
          duration: totalDuration * frame.progress,
          easing: getEasing(timingFunction),
        }),
      );
    }),
  ] as [AnimatableValue, AnimatableValue, ...AnimatableValue[]];
}

function resolveAnimationValue(
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

export function parseValue(
  value: RuntimeValueDescriptor | string | number | boolean,
): RuntimeValue {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
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
        const style = getCurrentEffect().getProps().style;
        if (style && typeof style.fontSize === "number") {
          return round(Number((style.fontSize || 0) * value.arguments[0]));
        }
      };
    }
    case "rem": {
      return function () {
        return round(rem.get() * value.arguments[0]);
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

// Walk an object, resolving any getters
export function resolveObject<T extends object>(obj: T) {
  for (var i in obj) {
    const v = obj[i];
    if (typeof v == "object" && v != null) resolveObject(v);
    else obj[i] = typeof v === "function" ? v() : v;
  }
}

export const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function round(number: number) {
  return Math.round((number + Number.EPSILON) * 100) / 100;
}

function getCurrentEffect() {
  return interopGlobal.current as unknown as PropStateEffect;
}

function getDimensions(
  dimension: "width" | "height" | "both",
  prop = "style",
): any {
  const effect = getCurrentEffect();
  const style = effect.getProps()[prop];

  if (dimension === "width") {
    return typeof style?.width === "number" ? style.width : effect.getWidth();
  } else if (dimension === "height") {
    return typeof style?.height === "number"
      ? style.height
      : effect.getHeight();
  } else {
    return {
      width: typeof style?.width === "number" ? style.width : effect.getWidth(),
      height:
        typeof style?.height === "number" ? style.height : effect.getHeight(),
    };
  }
}

function getVariable(name: any) {
  return resolve(getCurrentEffect().getVariable(name));
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
