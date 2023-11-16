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
import { StyleSheet } from "./stylesheet";
import { effectContext, globalVariables } from "./inheritance";
import {
  ExtractedStyleValue,
  GetInteraction,
  Interaction,
  StyleProp,
} from "../../types";
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
import {
  animationMap,
  createPropAccumulator,
  defaultValues,
  reduceInlineStyle,
  resolveAnimationValue,
  styleSignals,
  timeToMS,
} from "./style";

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
  const layoutSignal = createSignal<[number, number] | undefined>(
    undefined,
    `${props.testID}#layout`,
  );
  const signalsSetDuringRender = new Set();
  let containerSignal: Signal<InteropComputed> | undefined;

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
      return layoutSignal.get() ?? [0, 0];
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
      interop.shouldUpdateContext = false;
      interop.convertToPressable = false;

      // Track signals set during render
      signalsSetDuringRender.clear();

      const acc = createPropAccumulator(interop);

      for (const [prop, { sources, nativeStyleToProp }] of options.config) {
        let propValue = props[prop] as StyleProp;

        if (propValue) {
          reduceInlineStyle(acc, prop, propValue);
        }

        for (const sourceProp of sources) {
          const source = props?.[sourceProp];
          if (typeof source !== "string") continue;
          StyleSheet.unstable_hook_onClassName?.(source);
          for (const className of source.split(/\s+/)) {
            let styles = styleSignals.get(className);
            if (!styles) continue;
            styles.reducer(acc);
          }
        }

        if (prop === "style") {
          const styleProp = acc.props[prop];
          if (styleProp && typeof styleProp.width === "number") {
            acc.requiresLayoutWidth = false;
          }
          if (styleProp && typeof styleProp.height === "number") {
            acc.requiresLayoutHeight = false;
          }

          const needsLayout =
            acc.requiresLayoutWidth || acc.requiresLayoutHeight;

          const seenAnimatedProps = new Set();

          if (acc.animations) {
            const {
              name: animationNames,
              duration: durations,
              delay: delays,
              iterationCount: iterationCounts,
            } = acc.animations;

            interop.isAnimated = true;

            if (needsLayout && !layoutSignal.peek()) {
              // Since layout isn't ready, subscribe to it so we can re-render when it is
              layoutSignal.get();
            } else {
              let names: string[] = [];
              let shouldResetAnimations = false;

              for (const name of animationNames) {
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
                acc.props.style ??= {};
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
                    durations[index % name.length],
                  );
                  const delay = timeToMS(delays[index % delays.length]);
                  const iterationCount =
                    iterationCounts[index % iterationCounts.length];
                  const iterations =
                    iterationCount.type === "infinite"
                      ? -1
                      : iterationCount.value;

                  for (const [key, [initialFrame, ...frames]] of Object.entries(
                    keyframes.frames,
                  )) {
                    if (seenAnimatedProps.has(key)) continue;
                    seenAnimatedProps.add(key);

                    const initialValue = resolveAnimationValue(
                      initialFrame,
                      key,
                      acc.props.style,
                      acc,
                    );

                    const sequence = frames.map(
                      ({ progress, ...descriptor }) => {
                        return withDelay(
                          delay,
                          withTiming(
                            resolveAnimationValue(
                              descriptor,
                              key,
                              acc.props.style,
                              acc,
                            ),
                            {
                              duration: totalDuration * progress,
                              easing: Easing.linear,
                            },
                          ),
                        );
                      },
                    ) as [AnimatableValue, ...AnimatableValue[]];

                    let sharedValue = interop.sharedValues[key];
                    if (!sharedValue) {
                      sharedValue = makeMutable(initialValue);
                      interop.sharedValues[key] = sharedValue;
                    } else {
                      sharedValue.value = initialValue;
                    }

                    sharedValue.value = withRepeat(
                      withSequence(...sequence),
                      iterations,
                    );

                    Object.defineProperty(acc.props[prop], key, {
                      configurable: true,
                      enumerable: true,
                      value: sharedValue,
                    });
                  }
                }
              } else {
                for (const name of names) {
                  const keyframes = animationMap.get(name);
                  if (!keyframes) {
                    continue;
                  }

                  for (const key of Object.keys(keyframes.frames)) {
                    Object.defineProperty(acc.props[prop], key, {
                      configurable: true,
                      enumerable: true,
                      value: interop.sharedValues[key],
                    });
                    seenAnimatedProps.add(key);
                  }
                }
              }
            }
          } else {
            interop.currentAnimationNames.clear();
          }

          // We only support transition on 'style' right now
          if (acc.transition) {
            interop.isAnimated = true;

            const {
              property: properties,
              duration: durations,
              delay: delays,
            } = acc.transition;

            for (let index = 0; index < properties.length; index++) {
              const key = properties[index];

              if (seenAnimatedProps.has(key)) continue;

              let value = acc.props[prop][key] ?? defaultValues[key];
              if (typeof value === "function") {
                value = value();
              }
              if (value === undefined) continue;

              seenAnimatedProps.add(key);

              const duration = timeToMS(durations[index % durations.length]);
              const delay = timeToMS(delays[index % delays.length]);
              // const easing: any =
              //   transition.timingFunction[
              //     index % transition.timingFunction.length
              //   ];

              let sharedValue = interop.sharedValues[key];
              if (!sharedValue) {
                sharedValue = makeMutable(value);
                interop.sharedValues[key] = sharedValue;
              }

              if (value !== sharedValue.value) {
                sharedValue.value = withDelay(
                  delay,
                  withTiming(value, { duration }),
                );
              }

              Object.defineProperty(acc.props[prop], key, {
                configurable: true,
                enumerable: true,
                value: sharedValue,
              });
            }
          }

          for (const [key, value] of Object.entries(interop.sharedValues)) {
            if (seenAnimatedProps.has(key)) continue;
            cancelAnimation(value);
            value.value = acc.props[prop][key] ?? defaultValues[key];
          }

          if (nativeStyleToProp) {
            for (let [key, targetProp] of Object.entries(nativeStyleToProp)) {
              if (targetProp === true) targetProp = key;
              acc.props[targetProp] = acc.props.style[key];
              delete acc.props.style[key];
            }
          }
        }

        if (typeof acc.props[prop] === "object") {
          for (const tKey of transformKeys) {
            if (tKey in acc.props[prop]) {
              acc.props[prop].transform ??= [];
              acc.props[prop].transform.push({
                [tKey]: acc.props[prop][tKey],
              });
              delete acc.props[prop][tKey];
            }
          }
        }
      }

      if (acc.hasActive || acc.hasContainer) {
        interop.convertToPressable = true;
        acc.props.onPressIn = (event: unknown) => {
          props.onPressIn?.(event);
          interop.setInteraction("active", true);
        };
        acc.props.onPressOut = (event: unknown) => {
          props.onPressOut?.(event);
          interop.setInteraction("active", false);
        };
      }
      if (acc.hasHover || acc.hasContainer) {
        interop.convertToPressable = true;
        acc.props.onHoverIn = (event: unknown) => {
          props.onHoverIn?.(event);
          interop.setInteraction("hover", true);
        };
        acc.props.onHoverOut = (event: unknown) => {
          props.onHoverIn?.(event);
          interop.setInteraction("hover", false);
        };
      }
      if (acc.hasFocus || acc.hasContainer) {
        interop.convertToPressable = true;
        acc.props.onFocus = (event: unknown) => {
          props.onFocus?.(event);
          interop.setInteraction("focus", true);
        };
        acc.props.onBlur = (event: unknown) => {
          props.onBlur?.(event);
          interop.setInteraction("focus", false);
        };
      }

      if (interop.convertToPressable) {
        acc.props.onPress = (event: unknown) => {
          props.onPress?.(event);
          interop.setInteraction("active", false);
        };
      }

      if (acc.requiresLayoutWidth || acc.requiresLayoutHeight) {
        if (!layoutSignal.peek()) {
          // Since layout isn't ready, subscribe to it so we can re-render when it is
          layoutSignal.get();
        }

        acc.props.onLayout = (event: LayoutChangeEvent) => {
          props.onLayout?.(event);
          const layout = event.nativeEvent.layout;
          const [width, height] = layoutSignal.peek() ?? [0, 0];
          if (layout.width !== width || layout.height !== height) {
            layoutSignal.set([layout.width, layout.height]);
          }
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
        inlineSignals.size !== signalsSetDuringRender.size ||
        (acc.forceContext && !interop.contextValue);

      if (interop.shouldUpdateContext) {
        // Duplicate this object, making it identify different
        interop.contextValue = Object.assign({}, interop as InteropComputed);
      }

      return { ...interop, props: acc.props };
    },
  };

  const interop: InteropComputed = Object.assign(
    createComputed(partialInterop.fn, false, props.testID?.toString()),
    partialInterop,
  );

  interop();

  return interop;
}
