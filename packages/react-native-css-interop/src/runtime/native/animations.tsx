import { AnimationIterationCount, AnimationName, Time } from "lightningcss";
import { ComponentType, useMemo, forwardRef, useState, useEffect } from "react";
import Animated, {
  AnimatableValue,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  AnimatableCSSProperty,
  ExtractedAnimation,
  InteropMeta,
  Style,
} from "../../types";
import { flattenStyle } from "./use-computed-props";
import { animationMap, styleMetaMap } from "./globals";
import { Pressable, Text, View } from "react-native";

type AnimationInteropProps = Record<string, unknown> & {
  __component: ComponentType<any>;
  __meta: InteropMeta;
};

const animatedCache = new WeakMap<ComponentType<any>, ComponentType<any>>([
  [View, Animated.View],
  [Animated.View, Animated.View],
  [Text, Animated.Text],
  [Animated.Text, Animated.Text],
  [Text, Animated.Text],
  [Pressable, Animated.createAnimatedComponent(Pressable)],
]);

/**
 * TODO: We could probably half the amount of code if this was rewritten to use useAnimatedProps
 */

/*
 * This component breaks the rules of hooks, however is it safe to do so as the animatedProps are static
 * If they do change, the key for this component will be regenerated forcing a remount (a reset of hooks)
 */
export const AnimationInterop = forwardRef(function Animated(
  { __component: Component, __meta: meta, ...props }: AnimationInteropProps,
  ref: unknown,
) {
  Component = createAnimatedComponent(Component);

  const isLayoutReady = useIsLayoutReady(meta);

  for (const prop of new Set([
    ...meta.transitionProps,
    ...meta.animatedProps,
  ])) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    props[prop] = useAnimationAndTransitions(
      props[prop] as Record<string, AnimatableValue>,
      meta,
      isLayoutReady,
    );
  }

  return <Component ref={ref} {...props} />;
});

/**
 * Returns if the component layout is calculated. If layout is not required, this will always return true
 */
function useIsLayoutReady({ requiresLayout, interaction }: InteropMeta) {
  const [layoutReady, setLayoutReady] = useState(
    requiresLayout ? interaction.layout.width.get() !== 0 : true,
  );

  useEffect(() => {
    if (layoutReady) {
      return undefined;
    }

    // We only need to listen for a single layout change
    const subscription = interaction.layout.width.subscribe(() => {
      setLayoutReady(true);
      subscription();
    });
    return () => subscription();
  }, [layoutReady]);

  return layoutReady;
}

type TimingFrameProperties = {
  duration: number;
  progress: number;
  value: AnimatableValue;
};

function useAnimationAndTransitions(
  style: Record<string, AnimatableValue>,
  meta: InteropMeta,
  isLayoutReady: boolean,
) {
  const {
    animations: {
      name: animationNames = emptyArray,
      duration: animationDurations = emptyArray,
      iterationCount: animationIterationCounts = emptyArray,
    } = {},
    transition: {
      property: transitions = emptyArray,
      duration: transitionDurations = emptyArray,
    } = {},
  } = styleMetaMap.get(style) || {};

  const [transitionProps, transitionValues] = useTransitions(
    transitions,
    transitionDurations,
    style,
  );

  const [animationProps, animationValues] = useAnimations(
    animationNames,
    animationDurations,
    animationIterationCounts,
    style,
    meta,
    isLayoutReady,
  );

  const animatedStyle = useAnimatedStyle(() => {
    const result: Record<string, unknown> = { ...style };

    if (style.fontWeight) {
      // Reanimated crashes if the fontWeight is numeric
      result.fontWeight = style.fontWeight?.toString();
    }

    if (style.transform) {
      result.transform = [];
    }

    function doAnimation(
      props: string[],
      values: SharedValue<AnimatableValue>[],
    ) {
      for (const [index, prop] of props.entries()) {
        const value = values[index].value;

        if (value !== undefined) {
          if (transformAttributes.has(prop)) {
            result.transform ??= [];
            (result.transform as any[]).push({ [prop]: value });
          } else {
            result[prop] = value;
          }
        }
      }
    }
    doAnimation(transitionProps, transitionValues);
    doAnimation(animationProps, animationValues);
    return result;
  }, [...transitionValues, ...animationValues]);

  // This doesn't have a runtime purpose, it just makes the unit tests easier to write
  styleMetaMap.set(animatedStyle, styleMetaMap.get(style)!);

  return animatedStyle;
}

function useTransitions(
  transitions: AnimatableCSSProperty[],
  transitionDurations: Time[],
  style: Record<string, AnimatableValue>,
) {
  const transitionProps: string[] = [];
  const transitionValues: SharedValue<AnimatableValue>[] = [];

  for (let index = 0; index < transitions.length; index++) {
    const prop = transitions[index];
    const value = style[prop] ?? defaultValues[prop];
    const duration = timeToMS(
      getValue(transitionDurations, index, {
        type: "seconds",
        value: 0,
      }),
    );

    if (prop === "transform") {
      const valueObj = Object.assign({}, ...((value || []) as any[]));

      for (const tProp of transformAttributes) {
        const tValue = valueObj[tProp] ?? defaultTransformValues[tProp];
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const sharedValue = useSharedValue(tValue);
        transitionProps.push(tProp);
        transitionValues.push(sharedValue);
        sharedValue.value = withTiming(tValue, { duration });
      }
    } else {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const sharedValue = useSharedValue(value);
      transitionProps.push(prop);
      transitionValues.push(sharedValue);
      sharedValue.value = withTiming(value, { duration });
    }
  }

  return [transitionProps, transitionValues] as const;
}

function useAnimations(
  animationNames: AnimationName[],
  animationDurations: Time[],
  animationIterationCounts: AnimationIterationCount[],
  style: Record<string, unknown>,
  { variables, inheritedContainers: containers, interaction }: InteropMeta,
  isLayoutReady: boolean,
) {
  const animations = useMemo(() => {
    const animations = new Map<string, TimingFrameProperties[]>();

    for (let index = 0; index < animationNames.length; index++) {
      const name = getValue(animationNames, index, { type: "none" });
      const totalDuration = timeToMS(
        getValue(animationDurations, index, {
          type: "seconds",
          value: 0,
        }),
      );

      let keyframes: ExtractedAnimation;
      if (name.type === "none") {
        keyframes = defaultAnimation;
      } else {
        keyframes = animationMap.get(name.value) || defaultAnimation;
      }

      const propProgressValues: Record<
        string,
        Record<number, AnimatableValue>
      > = {};

      for (const { style: $style, selector: progress } of keyframes.frames) {
        const flatStyle = flattenStyle($style, {
          variables,
          interaction,
          containers,
          ch: typeof style.height === "number" ? style.height : undefined,
          cw: typeof style.width === "number" ? style.width : undefined,
        });

        // TODO: Allow for non-style props to be animated
        for (let [prop, value] of Object.entries(flatStyle)) {
          if (prop === "transform") {
            if (value.length === 0) {
              value = defaultTransformStyle;
            }
            for (const transformValue of value) {
              const [[$prop, $value]] = Object.entries(transformValue);
              propProgressValues[$prop] ??= {};
              propProgressValues[$prop][progress] = $value as AnimatableValue;
            }
          } else {
            propProgressValues[prop] ??= {};
            propProgressValues[prop][progress] = value as AnimatableValue;
          }
        }
      }

      for (const [prop, progressValues] of Object.entries(propProgressValues)) {
        const orderedProgress = Object.keys(progressValues)
          .map((v) => parseFloat(v))
          .sort((a, b) => a - b);

        const frames: TimingFrameProperties[] = [];

        if (orderedProgress[0] !== 0) {
          frames.push({
            progress: 0,
            duration: 0,
            value: PLACEHOLDER,
          });
        }

        for (let i = 0; i < orderedProgress.length; i++) {
          const progress = orderedProgress[i];
          const value = progressValues[progress];
          const previousProgress =
            progress === 0 || i === 0 ? 0 : orderedProgress[i - 1];

          frames.push({
            duration: totalDuration * (progress - previousProgress),
            progress,
            value,
          });
        }

        animations.set(prop, frames);
      }
    }

    return animations;
  }, [animationNames, isLayoutReady]);

  /*
   * Create a shared value for each animation property with a default value
   */
  const animationProps: string[] = [];
  const animationValues: SharedValue<AnimatableValue>[] = [];
  for (const [prop, [first]] of animations.entries()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const a = useSharedValue(getInitialValue(prop, first, style));
    animationValues.push(a);
    animationProps.push(prop);
  }

  /*
   * If the frames ever change, reset the animation
   * This also prevents the animation from resetting when other state changes
   */
  useMemo(() => {
    const entries = Array.from(animations.entries());
    for (const [index, [prop, [first, ...rest]]] of entries.entries()) {
      const sharedValue = animationValues[index];
      const iterations = getIterations(animationIterationCounts, index);

      // Reset the value to the first frame
      sharedValue.value = getInitialValue(prop, first, style);

      // Create timing animations for the rest of the frames
      const timing = rest.map(({ duration, value }) => {
        return withTiming(value, { duration });
      }) as [AnimatableValue, ...AnimatableValue[]];

      sharedValue.value = withRepeat(withSequence(...timing), iterations);
    }
  }, [animations, animationIterationCounts]);

  return [animationProps, animationValues] as const;
}

function getInitialValue(
  prop: string,
  frame: TimingFrameProperties,
  style: Style,
): AnimatableValue {
  if (frame.value === PLACEHOLDER) {
    if (transformAttributes.has(prop)) {
      const initialTransform = style.transform?.find((t) => {
        return t[prop as keyof typeof t] !== undefined;
      });

      return initialTransform
        ? initialTransform[prop as keyof typeof initialTransform]
        : defaultTransformValues[prop];
    } else {
      return style[prop as keyof Style] as AnimatableValue;
    }
  } else {
    return frame.value;
  }
}

function getValue<T>(array: T[] | undefined, index: number, defaultValue: T) {
  return array && array.length > 0 ? array[index % array.length] : defaultValue;
}

const PLACEHOLDER = {} as AnimatableValue;
const emptyArray: any[] = [];
const defaultAnimation: ExtractedAnimation = { frames: [] };
const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};
const getIterations = (
  iterations: AnimationIterationCount[],
  index: number,
) => {
  const iteration = getValue(iterations, index, { type: "infinite" });
  return iteration.type === "infinite" ? Infinity : iteration.value;
};

export const defaultValues: {
  [K in AnimatableCSSProperty]?: K extends keyof Style ? Style[K] : unknown;
} = {
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
  color: "transparent",
  flex: 1,
  flexBasis: 1,
  flexGrow: 1,
  flexShrink: 1,
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
  maxHeight: 0,
  maxWidth: 0,
  minHeight: 0,
  minWidth: 0,
  opacity: 1,
  padding: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  paddingTop: 0,
  right: 0,
  top: 0,
  zIndex: 0,
};

const defaultTransformStyle = [
  { perspective: 1 },
  { translateX: 0 },
  { translateY: 0 },
  { scaleX: 1 },
  { scaleY: 1 },
  { rotate: "0deg" },
  { rotateX: "0deg" },
  { rotateY: "0deg" },
  { rotateZ: "0deg" },
  { skewX: "0deg" },
  { skewY: "0deg" },
  { scale: 1 },
];
const defaultTransformValues = Object.fromEntries(
  defaultTransformStyle.flatMap((style) => Object.entries(style)),
);
const transformAttributes = new Set(Object.keys(defaultTransformValues));

export function createAnimatedComponent(
  Component: ComponentType<any>,
): ComponentType<any> {
  if (animatedCache.has(Component)) {
    return animatedCache.get(Component)!;
  } else if (Component.displayName?.startsWith("AnimatedComponent")) {
    return Component;
  }

  if (
    !(
      typeof Component !== "function" ||
      (Component.prototype && Component.prototype.isReactComponent)
    )
  ) {
    throw new Error(
      `Looks like you're passing an animation style to a function component \`${Component.name}\`. Please wrap your function component with \`React.forwardRef()\` or use a class component instead.`,
    );
  }

  const AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );

  animatedCache.set(Component, AnimatedComponent);

  return AnimatedComponent;
}
