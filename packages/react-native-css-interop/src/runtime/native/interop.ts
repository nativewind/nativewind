import { useContext, useEffect, useRef, useSyncExternalStore } from "react";
import { LayoutChangeEvent } from "react-native";
import {
  Computed as Computed,
  Signal,
  cleanupEffect,
  createComputed,
  createSignal,
  reactGlobal,
} from "../signals";
import { NormalizedOptions } from "./prop-mapping";
import { fastReloadSignal, StyleSheet, getGlobalStyle } from "./stylesheet";
import { effectContext, globalVariables } from "./inheritance";
import {
  ExtractedAnimations,
  ExtractedStyleFrame,
  ExtractedStyleValue,
  ExtractedTransition,
  GetInteraction,
  Interaction,
  StyleProp,
} from "../../types";
import { styleSpecificityCompareFn } from "../specificity";
import { extractValue, flattenStyle } from "./flatten-style";
import { DEFAULT_CONTAINER_NAME, transformKeys } from "../../shared";
import {
  AnimatableValue,
  Easing,
  SharedValue,
  cancelAnimation,
  makeMutable,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Time } from "lightningcss";
import { colorScheme } from "./color-scheme";
import { styleMetaMap, animationMap } from "../globals";

export interface InteropComputed extends Computed<any> {
  rerender(parent: InteropComputed, props: Record<string, unknown>): void;
  // tracking
  props: Record<string, unknown>;
  parent: InteropComputed;
  lastDependencies: unknown[];
  // Rendering
  contextValue?: InteropComputed;
  shouldUpdateContext: boolean;
  convertToPressable: boolean;
  requiresLayout: boolean;
  isLayoutReady: () => boolean;
  signals: Map<string, Signal<any>>;
  // Variable
  getVariable: (name: string) => ExtractedStyleValue;
  setVariable: (name: string, value: ExtractedStyleValue) => void;
  hasSetVariable: (name: string) => boolean;
  getContainer: (name: string) => InteropComputed | undefined;
  setContainer: (name: string) => void;
  getLayout(): [number, number];
  getInteraction: GetInteraction;
  cleanup(): void;
  setInteraction: <T extends keyof Interaction>(
    name: T,
    value: Parameters<NonNullable<Interaction[T]>["set"]>[0],
  ) => void;
  // Animations
  isAnimated: boolean;
  sharedValues: Record<string, SharedValue<any>>;
  currentAnimationNames: Set<string>;
}

export function useInteropComputed(
  props: Record<string, unknown>,
  options: NormalizedOptions<Record<string, unknown>>,
) {
  const parent = useContext(effectContext);
  const interopRef = useRef<InteropComputed>();

  if (!interopRef.current) {
    interopRef.current = createInteropComputed(options, props, parent);
  } else {
    interopRef.current.rerender(parent, props);
  }

  const interop = interopRef.current;

  /**
   * Always run the effect so it can test the props/parent
   */

  // If we unmount we need to cleanup the store's subscribers
  useEffect(() => () => interop.cleanup(), []);

  // If there are any delayedEffects, run them after render
  useEffect(() => {
    if (reactGlobal.delayedEvents.size) {
      for (const sub of reactGlobal.delayedEvents) {
        sub();
      }
      reactGlobal.delayedEvents.clear();
    }
  });

  return useSyncExternalStore(interop.subscribe, interop.peek, interop.peek);
}

export function createInteropComputed(
  options: NormalizedOptions<Record<string, unknown>>,
  props: Record<string, unknown>,
  parent: InteropComputed,
): InteropComputed {
  const interaction: Interaction = {};

  const inlineSignals = new Map();
  const layoutSignal = createSignal([0, 0], `${props.testID}#layout`);
  const signalsSetDuringRender = new Set();
  let containerSignal: Signal<InteropComputed> | undefined;
  let hasInlineContainers: boolean = false;

  let partialInterop: Omit<
    InteropComputed,
    Exclude<keyof Computed<any>, "fn">
  > = {
    // tracking
    props,
    parent,
    lastDependencies: [],
    sharedValues: {},
    isAnimated: false,
    currentAnimationNames: new Set(),
    // rendering
    shouldUpdateContext: false,
    requiresLayout: false,
    convertToPressable: false,
    // animations
    signals: new Map(),
    setVariable(name, value) {
      signalsSetDuringRender.add(name);
      let signal = inlineSignals.get(name);
      if (!signal) {
        signal = createSignal(value, name);
        interop.shouldUpdateContext = true;
        inlineSignals.set(name, signal);
      } else {
        signal.set(value);
      }
    },
    cleanup() {
      cleanupEffect(interop);
    },
    getVariable(name) {
      // Try the inline variables
      let signal = inlineSignals.get(name);
      if (signal && signal.peek() !== undefined) {
        return signal.get();
      }

      // Try the universal variables
      signal = globalVariables.universal.get(name);
      if (signal && signal.peek() !== undefined) {
        return signal.get();
      }

      // Try the inherited variables
      signal = parent.signals.get(name);
      if (signal && signal.peek() !== undefined) {
        return signal.get();
      }
    },
    hasSetVariable(name) {
      return signalsSetDuringRender.has(name);
    },
    getContainer(name) {
      return parent.signals.get(name)?.get();
    },
    setContainer(name) {
      containerSignal ??= createSignal(interop as InteropComputed, name);
      hasInlineContainers = true;
      inlineSignals.set(name, containerSignal);
      signalsSetDuringRender.add(name);
      inlineSignals.set(DEFAULT_CONTAINER_NAME, containerSignal);
      signalsSetDuringRender.add(DEFAULT_CONTAINER_NAME);
    },
    getInteraction(name) {
      if (!interaction[name]) {
        interaction[name] = createSignal(false, name) as any;
      }

      return interaction[name]!;
    },
    setInteraction(name, value) {
      if (name in interaction) {
        interaction[name]!.set(value as any);
      } else {
        interaction[name] = createSignal(value, name) as any;
      }
    },
    getLayout() {
      return layoutSignal.get()! as [number, number];
    },
    isLayoutReady() {
      return interop.getLayout()[0] !== 0;
    },
    rerender(parent, props) {
      let shouldRerender =
        parent !== interop.parent ||
        options.dependencies.some(
          (k, i) => props[k] !== interop.lastDependencies[i],
        );

      // This should be false most of the time. If a variable changes, the signal will re-run
      // So by the time we get here, the values will be the same
      if (shouldRerender) {
        interop.props = props;
        interop.parent = parent;
        interop();
      }
    },
    fn() {
      const props: Record<string, any> = interop.props;

      // Update the tracking
      reactGlobal.delayedEvents.delete(interop as InteropComputed);
      interop.lastDependencies = options.dependencies.map((k) => props![k]);
      interop.requiresLayout = false;
      interop.shouldUpdateContext = false;
      interop.convertToPressable = false;

      // Track signals set during render
      signalsSetDuringRender.clear();
      hasInlineContainers = false;

      // Listen for fast-reload
      // TODO: This should be improved...
      fastReloadSignal.get();

      const styledProps: Record<string, any> = {};

      let hasActive: boolean | undefined = false;
      let hasHover: boolean | undefined = false;
      let hasFocus: boolean | undefined = false;
      interop.requiresLayout = false;

      let dynamicStyles = false;

      for (const [key, { sources, nativeStyleToProp }] of options.config) {
        dynamicStyles ||= Boolean(nativeStyleToProp);

        let prop = props[key] as StyleProp;
        let stylesToFlatten: StyleProp = [];
        if (prop) {
          if (Array.isArray(prop)) {
            prop = prop.flat(10);
            for (const style of prop) {
              if (!style) continue;
              dynamicStyles ||= styleMetaMap.has(style);
              stylesToFlatten.push(getGlobalStyle(style));
            }
          } else {
            dynamicStyles ||= styleMetaMap.has(prop);
            stylesToFlatten.push(getGlobalStyle(prop));
          }
        }

        for (const sourceProp of sources) {
          const source = props?.[sourceProp];
          if (typeof source !== "string") continue;

          StyleSheet.unstable_hook_onClassName?.(source);

          for (const className of source.split(/\s+/)) {
            let styles = getGlobalStyle(className);
            if (!styles) continue;

            if (Array.isArray(styles)) {
              for (const style of styles) {
                if (!style) continue;
                dynamicStyles ||= styleMetaMap.has(style);
                stylesToFlatten.push(style);
              }
            } else {
              dynamicStyles ||= styleMetaMap.has(styles);
              stylesToFlatten.push(styles);
            }
          }
        }

        stylesToFlatten = stylesToFlatten.sort(
          styleSpecificityCompareFn(dynamicStyles ? "desc" : "asc"),
        );

        if (stylesToFlatten.length === 1) {
          stylesToFlatten = stylesToFlatten[0] as StyleProp;
        }

        if (!stylesToFlatten) continue;

        // If the styles are not dynamic, then we can avoid flattenStyle
        if (!dynamicStyles) {
          styledProps[key] = stylesToFlatten;
          continue;
        }

        let style: Record<string, any> = flattenStyle(
          stylesToFlatten,
          interop as InteropComputed,
          {},
          {},
        );
        const meta = styleMetaMap.get(style);

        style = { ...style };
        if (meta) {
          styleMetaMap.set(style, meta);
        }

        if (meta) {
          /**
           * If the style could possibly add variables or containers (even if not currently),
           * we the effect should create a context. This stop children unmounting
           * when the variables/containers become active
           */
          if (meta.wrapInContext && !interop.contextValue) {
            interop.shouldUpdateContext = true;
          }

          hasActive ||= hasInlineContainers || meta.pseudoClasses?.active;
          hasHover ||= hasInlineContainers || meta.pseudoClasses?.hover;
          hasFocus ||= hasInlineContainers || meta.pseudoClasses?.focus;
          interop.requiresLayout ||= Boolean(hasInlineContainers);

          if (meta.nativeProps) {
            for (let prop of Object.values(meta.nativeProps)) {
              if (prop in style) {
                styledProps[prop] = style[prop];
                delete style[prop];
              }
            }
          }
        }

        /**
         * Map the flatStyle to the correct prop and/or move style properties to props (nativeStyleToProp)
         *
         * Note: We freeze the flatStyle as many of its props are getter's without a setter
         *  Freezing the whole object keeps everything consistent
         */
        if (nativeStyleToProp) {
          for (let [key, targetProp] of Object.entries(nativeStyleToProp)) {
            if (key in style) {
              if (typeof targetProp === "string") {
                styledProps[targetProp] = style[key];
              } else {
                styledProps[key] = style[key];
              }
              delete style[key];
            }
          }
        }

        styledProps[key] = style;

        const seenAnimatedProps = new Set();

        if (key === "style" && meta?.animations) {
          const needsLayout = Boolean(
            (meta.requiresLayoutWidth && style.width === undefined) ||
              (meta.requiresLayoutHeight && style.height === undefined),
          );

          interop.requiresLayout ||= Boolean(
            meta.requiresLayoutWidth || meta.requiresLayoutHeight,
          );

          interop.isAnimated = true;

          if (needsLayout && !interop.isLayoutReady()) {
            // Since layout isn't ready, subscribe to it so we can re-render when it is
            layoutSignal.get();
          } else {
            const a = { ...defaultAnimation, ...meta.animations };

            let names: string[] = [];
            let shouldResetAnimations = false;

            for (const name of a.name) {
              if (name.type === "none") {
                names = [];
                interop.currentAnimationNames.clear();
                break;
              }

              names.push(name.value);

              if (!interop.currentAnimationNames.has(name.value)) {
                shouldResetAnimations = true;
              }
            }

            if (shouldResetAnimations) {
              interop.currentAnimationNames.clear();

              // Loop in reverse order
              for (let index = names.length - 1; index >= 0; index--) {
                const name = names[index % names.length];
                interop.currentAnimationNames.add(name);

                const keyframes = animationMap.get(name);
                if (!keyframes) {
                  continue;
                }

                const totalDuration = timeToMS(
                  a.duration[index % a.name.length],
                );
                const delay = timeToMS(a.delay[index % a.delay.length]);
                const iterationCount =
                  a.iterationCount[index % a.iterationCount.length];
                const iterations =
                  iterationCount.type === "infinite"
                    ? -1
                    : iterationCount.value;

                for (const [prop, [initialFrame, ...frames]] of Object.entries(
                  keyframes.frames,
                )) {
                  if (seenAnimatedProps.has(prop)) continue;
                  seenAnimatedProps.add(prop);

                  const initialValue = extractAnimationValue(
                    initialFrame,
                    prop,
                    style,
                    meta,
                    interop,
                  );

                  const sequence = frames.map((frame) => {
                    return withDelay(
                      delay,
                      withTiming(
                        extractAnimationValue(
                          frame,
                          prop,
                          style,
                          meta,
                          interop,
                        ),
                        {
                          duration: totalDuration * frame.progress,
                          easing: Easing.linear,
                        },
                      ),
                    );
                  }) as [AnimatableValue, ...AnimatableValue[]];

                  let sharedValue = interop.sharedValues[prop];
                  if (!sharedValue) {
                    sharedValue = makeMutable(initialValue);
                    interop.sharedValues[prop] = sharedValue;
                  } else {
                    sharedValue.value = initialValue;
                  }

                  sharedValue.value = withRepeat(
                    withSequence(...sequence),
                    iterations,
                  );

                  styledProps[key][prop] = sharedValue;
                }
              }
            } else {
              for (const name of names) {
                const keyframes = animationMap.get(name);
                if (!keyframes) {
                  continue;
                }

                for (const prop of Object.keys(keyframes.frames)) {
                  styledProps[key][prop] = interop.sharedValues[prop];
                  seenAnimatedProps.add(prop);
                }
              }
            }
          }
        } else {
          interop.currentAnimationNames.clear();
        }

        // We only support transition on 'style' right now
        if (key === "style" && meta?.transition) {
          interop.isAnimated = true;

          const t = { ...defaultTransition, ...meta.transition };
          for (let index = 0; index < t.property.length; index++) {
            const prop = t.property[index];

            if (seenAnimatedProps.has(prop)) continue;

            let value: any = style[prop] ?? defaultValues[prop];
            if (typeof value === "function") {
              value = value();
            }
            if (value === undefined) continue;

            seenAnimatedProps.add(prop);

            const duration = timeToMS(t.duration[index % t.duration.length]);
            const delay = timeToMS(t.delay[index % t.delay.length]);
            // const easing: any =
            //   transition.timingFunction[
            //     index % transition.timingFunction.length
            //   ];

            let sharedValue = interop.sharedValues[prop];
            if (!sharedValue) {
              sharedValue = makeMutable(value);
              interop.sharedValues[prop] = sharedValue;
            }

            if (value !== sharedValue.value) {
              sharedValue.value = withDelay(
                delay,
                withTiming(value, { duration }),
              );
            }

            styledProps[key][prop] = sharedValue;
          }
        }

        for (const [key, value] of Object.entries(interop.sharedValues)) {
          if (seenAnimatedProps.has(key)) continue;
          cancelAnimation(value);
          value.value = styledProps[key] ?? defaultValues[key];
        }

        for (const tKey of transformKeys) {
          if (tKey in styledProps[key]) {
            styledProps[key].transform ??= [];
            styledProps[key].transform.push({
              [tKey]: styledProps[key][tKey],
            });
            delete styledProps[key][tKey];
          }
        }
      }

      styledProps.onLayout = (event: LayoutChangeEvent) => {
        props.onLayout?.(event);
        const layout = event.nativeEvent.layout;

        const [width, height] = layoutSignal.peek()!;

        if (layout.width !== width || layout.height !== height) {
          layoutSignal.set([layout.width, layout.height]);
        }
      };

      if (hasActive) {
        interop.convertToPressable = true;
        styledProps.onPressIn = (event: unknown) => {
          props.onPressIn?.(event);
          interop.setInteraction("active", true);
        };
        styledProps.onPressOut = (event: unknown) => {
          props.onPressOut?.(event);
          interop.setInteraction("active", false);
        };
      }
      if (hasHover) {
        interop.convertToPressable = true;
        styledProps.onHoverIn = (event: unknown) => {
          props.onHoverIn?.(event);
          interop.setInteraction("hover", true);
        };
        styledProps.onHoverOut = (event: unknown) => {
          props.onHoverIn?.(event);
          interop.setInteraction("hover", false);
        };
      }
      if (hasFocus) {
        interop.convertToPressable = true;
        styledProps.onFocus = (event: unknown) => {
          props.onFocus?.(event);
          interop.setInteraction("focus", true);
        };
        styledProps.onBlur = (event: unknown) => {
          props.onBlur?.(event);
          interop.setInteraction("focus", false);
        };
      }

      if (interop.convertToPressable) {
        styledProps.onPress = (event: unknown) => {
          props.onPress?.(event);
          interop.setInteraction("active", false);
        };
      }

      interop.signals = new Map([
        ...parent.signals,
        ...globalVariables.universal,
        ...inlineSignals,
      ]);
      /**
       * Clear any variables that were not used.
       *
       * We do this by setting them to undefined, which will cause the signals to re-run.
       * Then we remove them from inheritance, so they are no present when the effects run
       *
       * Note: we don't need to worry about garbage collection, as the effects
       *   will remove themselves from the signal when they re-run, leaving no references
       */
      for (const [name, signal] of inlineSignals) {
        if (!signalsSetDuringRender.has(name)) {
          signal.set(undefined);
          inlineSignals.delete(name);
          interop.shouldUpdateContext = true;
        }
      }
      interop.shouldUpdateContext ||=
        inlineSignals.size !== signalsSetDuringRender.size;

      if (interop.shouldUpdateContext) {
        // Duplicate this object, making it identify different
        interop.contextValue = Object.assign({}, interop as InteropComputed);
      }

      return { ...interop, styledProps };
    },
  };

  const interop: InteropComputed = Object.assign(
    createComputed(partialInterop.fn, false, props.testID?.toString()),
    partialInterop,
  );

  interop();

  return interop;
}

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

const timeToMS = (time: Time) => {
  return time.type === "milliseconds" ? time.value : time.value * 1000;
};

function extractAnimationValue(
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
      : extractValue(frame.value, style, meta, interop);

  return typeof value === "function" ? value() : value;
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
