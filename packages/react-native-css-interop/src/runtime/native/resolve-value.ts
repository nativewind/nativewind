import { PixelRatio, Platform, PlatformColor, StyleSheet } from "react-native";
import {
  AnimatableValue,
  Easing,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import type { EasingFunction, Time } from "lightningcss";
import type {
  PropAccumulator,
  RuntimeValueDescriptor,
  RuntimeValueFrame,
} from "../../types";
import { rem, systemColorScheme, vh, vw } from "./globals";
import { Effect } from "../observable";
import { transformKeys } from "../../shared";

export function resolve(
  acc: PropAccumulator,
  args: RuntimeValueDescriptor,
): any {
  if (typeof args !== "object") {
    return args;
  }

  if (!Array.isArray(args)) {
    return "arguments" in args ? parseValue(acc, args) : args;
  }

  let resolved = [];

  for (let value of args) {
    value = resolve(acc, value);

    if (value !== undefined) {
      resolved.push(value);
    }
  }

  return resolved;
}

export function parseValue(
  acc: PropAccumulator,
  value: RuntimeValueDescriptor | string | number | boolean,
): any {
  if (typeof value !== "object" || !value) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v) => parseValue(acc, v));
  }

  if (!("name" in value)) return value;

  switch (value.name) {
    case "var": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "string"
        ? (acc.getVariable(descriptor) as any)
        : undefined;
    }
    case "vh": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? round((vh.get(acc.state) / 100) * descriptor)
        : undefined;
    }
    case "vw": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? round((vw.get(acc.state) / 100) * descriptor)
        : undefined;
    }
    case "em": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? round(acc.getFontSize() * descriptor)
        : undefined;
    }
    case "rem": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? round(rem.get(acc.state) * descriptor)
        : undefined;
    }
    case "rnh": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? round(acc.getHeight() * descriptor)
        : undefined;
    }
    case "rnw": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? round(acc.getWidth() * descriptor)
        : undefined;
    }
    case "rgb":
    case "rgba": {
      const args = resolve(acc, value.arguments).flat(10);
      if (args.length === 3) {
        return `rgb(${args.join(", ")})`;
      } else if (args.length === 4) {
        return `rgba(${args.join(", ")})`;
      } else {
        return;
      }
    }
    case "hsla": {
      const args = resolve(acc, value.arguments).flat(10);
      if (args.length === 3) {
        return `hsl(${args.join(" ")})`;
      } else if (args.length === 4) {
        return `hsla(${
          args.slice(0, 3).join(' ') + ' / ' + args[3]
        })`;
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
      return resolve(acc, Platform.select(value.arguments[0] as any));
    }
    case "getPixelSizeForLayoutSize": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? PixelRatio.getPixelSizeForLayoutSize(descriptor)
        : undefined;
    }
    case "fontScale": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? PixelRatio.getFontScale() * descriptor
        : undefined;
    }
    case "pixelScale": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? PixelRatio.get() * descriptor
        : undefined;
    }
    case "pixelScaleSelect": {
      const specifics = value.arguments[0] as any;
      return resolve(acc, specifics[PixelRatio.get()] ?? specifics["default"]);
    }
    case "fontScaleSelect": {
      const specifics = value.arguments[0] as any;
      return resolve(
        acc,
        specifics[PixelRatio.getFontScale()] ?? specifics["default"],
      );
    }
    case "roundToNearestPixel": {
      const descriptor = resolve(acc, value.arguments[0]);
      return typeof descriptor === "number"
        ? PixelRatio.roundToNearestPixel(descriptor)
        : undefined;
    }
    default: {
      const args = resolve(acc, value.arguments).join(",");
      return `${value.name}(${args})`;
    }
  }
}

export function resolveAnimation(
  acc: PropAccumulator,
  [initialFrame, ...frames]: RuntimeValueFrame[],
  prop: string,
  props: Record<string, any>,
  delay: number,
  totalDuration: number,
  timingFunction: EasingFunction,
): [AnimatableValue, AnimatableValue, ...AnimatableValue[]] {
  const initialValue = resolveAnimationValue(
    acc,
    initialFrame.value,
    prop,
    props,
  );

  return [
    initialValue,
    ...frames.map((frame) => {
      return withDelay(
        delay,
        withTiming(resolveAnimationValue(acc, frame.value, prop, props), {
          duration: totalDuration * frame.progress,
          easing: getEasing(timingFunction),
        }),
      );
    }),
  ] as [AnimatableValue, AnimatableValue, ...AnimatableValue[]];
}

function resolveAnimationValue(
  acc: PropAccumulator,
  value: RuntimeValueDescriptor,
  prop: string,
  style: Record<string, any> = {},
) {
  if (value === "!INHERIT!") {
    return style[prop] ?? defaultValues[prop];
  } else {
    return resolve(acc, value);
  }
}

export function resolveTransitionValue(acc: PropAccumulator, property: string) {
  let value: any;

  if (transformKeys.has(property)) {
    value = acc.transformLookup[property];
  } else {
    value = acc.props.style[property];
  }

  return value;
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

export function setDeepStyle(
  acc: PropAccumulator,
  pathTokens: string[],
  value: any,
  target: Record<string, any> = acc.props,
) {
  for (let i = 0; i < pathTokens.length; i++) {
    const token = pathTokens[i];

    // The last token
    if (i === pathTokens.length - 1) {
      value = parseValue(acc, value);
      if (transformKeys.has(token)) {
        target.transform ??= [];
        const existing = target.transform.find(
          (t: object) => Object.keys(t)[0] === token,
        );
        if (existing) {
          existing[token] = value;
        } else {
          target.transform.push({ [token]: value });
        }
        acc.transformLookup[token] = value;
      } else {
        target[token] = value;
      }
    } else {
      target[token] ??= {};
      target = target[token];
    }
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
