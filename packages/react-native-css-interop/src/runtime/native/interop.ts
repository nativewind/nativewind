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
  GetInteraction,
  Interaction,
  NativeStyleToProp,
  RuntimeStyle,
  RuntimeValue,
  RuntimeValueDescriptor,
} from "../../types";
import { DEFAULT_CONTAINER_NAME, STYLE_SCOPES } from "../../shared";
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
  styleSignals,
  timeToMS,
  reduceStyles,
  resolveAnimationValue,
  PropAccumulator,
  opaqueStyles,
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
  getVariable: (name: string) => RuntimeValue;
  setVariable: (name: string, value: RuntimeValueDescriptor) => void;
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
  animationWaitingOnLayout: boolean;
  sharedValues: Record<string, SharedValue<any>>;
  currentAnimationNames: Set<string>;
  acc: PropAccumulator;
}

type Layers = Record<0 | 1 | 2, Array<RuntimeStyle | object>> & {
  classNames: string;
};

export function useInteropComputed(
  props: Record<string, unknown>,
  options: NormalizedOptions,
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
  options: NormalizedOptions,
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
    animationWaitingOnLayout: false,
    acc: {} as PropAccumulator,
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

      const mapping: [string, Layers, NativeStyleToProp<any> | undefined][] =
        [];
      let acc = createPropAccumulator(interop);
      interop.acc = acc;
      let maxScope = STYLE_SCOPES.STATIC;

      // Collect everything into the specificity layers and calculate the max scope
      for (const [prop, sourceProp, nativeStyleToProp] of options.config) {
        const classNames = props?.[sourceProp];
        if (typeof classNames !== "string") continue;
        StyleSheet.unstable_hook_onClassName?.(classNames);

        const layers: Layers = {
          classNames,
          0: [],
          1: [],
          2: [],
        };

        for (const className of classNames.split(/\s+/)) {
          let signal = styleSignals.get(className);
          if (!signal) continue;
          const meta = signal.get();
          maxScope = Math.max(maxScope, meta.scope);
          if (meta[0]) layers[0].push(...meta[0]);
          if (meta[1]) layers[1].push(...meta[1]);
          if (meta[2]) layers[2].push(...meta[2]);
        }

        let inlineStyles = props?.[prop];
        if (inlineStyles) {
          if (Array.isArray(inlineStyles)) {
            layers[1].push(
              ...inlineStyles.flat(10).map((style) => {
                if (opaqueStyles.has(style)) {
                  style = opaqueStyles.get(style)!;
                }
                return style;
              }),
            );
          } else {
            if (opaqueStyles.has(inlineStyles)) {
              inlineStyles = opaqueStyles.get(inlineStyles)!;
            }
            layers[1].push(inlineStyles);
          }
        }

        mapping.push([prop, layers, nativeStyleToProp]);
      }

      /**
       * Process the styles in order of layers
       *  0: className
       *  1: inline
       *  2: important
       *  3: transitions
       *  4: animations
       *
       * We swap the processing order of 3 and 4, so we can skip already processed attributes
       */
      for (const [prop, layers, nativeStyleToProp] of mapping) {
        // Layer 0 - className
        if (layers[0].length) {
          reduceStyles(acc, prop, layers[0], maxScope);
        }

        // Layer 1 - inline
        if (layers[1].length) {
          reduceStyles(acc, prop, layers[1], maxScope);
        }

        // Layer 2 - important
        if (layers[2].length) {
          reduceStyles(acc, prop, layers[2], maxScope);
        }

        // This is where the magic happens!
        // Non-static styles need to be resolved.
        if (maxScope !== STYLE_SCOPES.STATIC && acc.props[prop]) {
          resolveObject(acc.props[prop]);
        }

        // Layer 3 & 4 only occur when the target is 'style'
        if (prop === "style") {
          const styleProp = acc.props[prop];
          if (styleProp && typeof styleProp.width === "number") {
            acc.requiresLayoutWidth = false;
          }
          if (styleProp && typeof styleProp.height === "number") {
            acc.requiresLayoutHeight = false;
          }

          const seenAnimatedProps = new Set();

          // Layer 4 - animations
          if (acc.animations) {
            const {
              name: animationNames,
              duration: durations,
              delay: delays,
              iterationCount: iterationCounts,
            } = acc.animations;

            interop.isAnimated = true;

            acc.props.style ??= {};

            let names: string[] = [];
            let shouldResetAnimations = interop.animationWaitingOnLayout;

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
              interop.currentAnimationNames.clear();
              interop.animationWaitingOnLayout = false;

              // Loop in reverse order
              for (let index = names.length - 1; index >= 0; index--) {
                const name = names[index % names.length];
                interop.currentAnimationNames.add(name);

                const keyframes = animationMap.get(name);
                if (!keyframes) {
                  continue;
                }

                const totalDuration = timeToMS(durations[index % name.length]);
                const delay = timeToMS(delays[index % delays.length]);
                const iterationCount =
                  iterationCounts[index % iterationCounts.length];
                const iterations =
                  iterationCount.type === "infinite"
                    ? -1
                    : iterationCount.value;

                if (keyframes.hoistedStyles) {
                  acc.hoistedStyles ??= [];
                  acc.hoistedStyles.push(...keyframes.hoistedStyles);
                }

                for (const [key, [initialFrame, ...frames]] of Object.entries(
                  keyframes.frames,
                )) {
                  if (seenAnimatedProps.has(key)) continue;
                  seenAnimatedProps.add(key);

                  const initialValue = resolveAnimationValue(
                    initialFrame.value,
                    key,
                    acc.props.style,
                  );

                  const sequence = frames.map((frame) => {
                    return withDelay(
                      delay,
                      withTiming(
                        resolveAnimationValue(
                          frame.value,
                          key,
                          acc.props.style,
                        ),
                        {
                          duration: totalDuration * frame.progress,
                          easing: Easing.linear,
                        },
                      ),
                    );
                  }) as [AnimatableValue, ...AnimatableValue[]];

                  interop.animationWaitingOnLayout =
                    (acc.requiresLayoutWidth || acc.requiresLayoutHeight) &&
                    !layoutSignal.peek();

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

                acc.props[prop] ??= {};

                if (keyframes.hoistedStyles) {
                  acc.hoistedStyles ??= [];
                  acc.hoistedStyles.push(...keyframes.hoistedStyles);
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
          } else {
            interop.currentAnimationNames.clear();
          }

          // Layer 3 - transitions
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

          // Cleanup any sharedValues that are no longer used
          for (const [key, value] of Object.entries(interop.sharedValues)) {
            if (seenAnimatedProps.has(key)) continue;
            cancelAnimation(value);
            value.value = acc.props[prop][key] ?? defaultValues[key];
          }
        }

        // Move any styles to the correct prop
        if (nativeStyleToProp) {
          for (let [key, targetProp] of Object.entries(nativeStyleToProp)) {
            if (targetProp === true) targetProp = key;
            if (acc.props.style[key] === undefined) continue;
            acc.props[prop] = acc.props.style[key];
            delete acc.props.style[key];
          }
        }

        debugger;

        // React Native has some nested styles, so we need to expand these values
        if (acc.hoistedStyles) {
          for (let [prop, key, transform] of acc.hoistedStyles) {
            if (acc.props[prop] && key in acc.props[prop]) {
              switch (transform) {
                case "transform":
                  acc.props[prop].transform ??= [];
                  acc.props[prop].transform.push({
                    [key]: acc.props[prop][key],
                  });
                  delete acc.props[prop][key];
                  break;
                case "shadow":
                  const [type, shadowKey] = key.split(".");
                  acc.props[prop][type] ??= {};
                  acc.props[prop][type][shadowKey] = acc.props[prop][key];
                  delete acc.props[prop][key];
                  break;
              }
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

      if (
        acc.requiresLayoutWidth ||
        acc.requiresLayoutHeight ||
        interop.animationWaitingOnLayout
      ) {
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

      return {
        props: acc.props,
        convertToPressable: interop.convertToPressable,
        isAnimated: interop.isAnimated,
        contextValue: interop.contextValue,
      };
    },
  };

  const interop: InteropComputed = Object.assign(
    createComputed(partialInterop.fn, false, props.testID?.toString()),
    partialInterop,
  );

  interop();

  return interop;
}

// function cloneObject<T extends object>(obj: T): T {
//   var clone = {} as T;
//   for (var i in obj) {
//     const v = obj[i];
//     if (typeof v == "object" && v != null) clone[i] = cloneObject(v);
//     else clone[i] = v;
//   }
//   return clone;
// }

// Walk an object, resolving any getters
function resolveObject<T extends object>(obj: T) {
  for (var i in obj) {
    const v = obj[i];
    if (typeof v == "object" && v != null) resolveObject(v);
    else obj[i] = typeof v === "function" ? v() : v;
  }
}
