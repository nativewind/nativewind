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
import {
  effectContext,
  rootVariables,
  universalVariables,
} from "./inheritance";
import {
  ExtractedStyleValue,
  GetInteraction,
  Interaction,
  StyleProp,
} from "../../types";
import { styleMetaMap } from "./misc";
import { styleSpecificityCompareFn } from "../specificity";
import { flattenStyle } from "./flatten-style";
import { DEFAULT_CONTAINER_NAME } from "../../shared";

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
  signals: Map<string, Signal<any>>;
  // Variable
  getVariable: (name: string) => ExtractedStyleValue;
  setVariable: (name: string, value: ExtractedStyleValue) => void;
  hasSetVariable: (name: string) => boolean;
  getContainer: (name: string) => InteropComputed | undefined;
  setContainer: (name: string) => void;
  getInteraction: GetInteraction;
  setInteraction: <T extends keyof Interaction>(
    name: T,
    value: Parameters<NonNullable<Interaction[T]>["set"]>[0],
  ) => void;
  // Animations
  animationInteropKey?: string;
  transitionProps: Set<string>;
  animatedProps: Set<string>;
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
  useEffect(() => () => cleanupEffect(interop), []);

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
    // rendering
    shouldUpdateContext: false,
    requiresLayout: false,
    convertToPressable: false,
    // animations
    animatedProps: new Set(),
    transitionProps: new Set(),
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
    getVariable(name) {
      // Try the inline variables
      let signal = inlineSignals.get(name);
      if (signal && signal.peek() !== undefined) {
        return signal.get();
      }

      // Try the universal variables
      signal = universalVariables.get(name);
      if (signal && signal.peek() !== undefined) {
        return signal.get();
      }

      // Try the inherited variables
      signal = parent.signals.get(name);
      if (signal && signal.peek() !== undefined) {
        return signal.get();
      }

      // Try the root variables
      signal = rootVariables.get(name);
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
        if (name === "layoutWidth" || name === "layoutHeight") {
          interaction[name] = createSignal(0, name) as any;
        } else {
          interaction[name] = createSignal(false, name) as any;
        }
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
      interop.animationInteropKey = undefined;
      interop.shouldUpdateContext = false;
      interop.convertToPressable = false;

      // Track signals set during render
      signalsSetDuringRender.clear();
      hasInlineContainers = false;

      // Listen for fast-reload
      // TODO: This should be improved...
      fastReloadSignal.get();

      const styledProps: Record<string, any> = {};
      interop.animatedProps.clear();
      interop.transitionProps.clear();

      let hasActive: boolean | undefined = false;
      let hasHover: boolean | undefined = false;
      let hasFocus: boolean | undefined = false;
      let requiresLayout: boolean | undefined = false;

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
              stylesToFlatten.push(style);
            }
          } else {
            dynamicStyles ||= styleMetaMap.has(prop);
            stylesToFlatten.push(prop);
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
          if (meta.animations) interop.animatedProps.add(key);
          if (meta.transition) interop.transitionProps.add(key);

          /**
           * If the style could possibly add variables or containers (even if not currently),
           * we the effect should create a context. This stop children unmounting
           * when the variables/containers become active
           */
          if (meta.wrapInContext && !interop.contextValue) {
            interop.shouldUpdateContext = true;
          }

          requiresLayout ||= hasInlineContainers || meta.requiresLayout;
          hasActive ||= hasInlineContainers || meta.pseudoClasses?.active;
          hasHover ||= hasInlineContainers || meta.pseudoClasses?.hover;
          hasFocus ||= hasInlineContainers || meta.pseudoClasses?.focus;
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
      }

      if (interop.animatedProps.size > 0 || interop.transitionProps.size > 0) {
        interop.animationInteropKey = [
          ...interop.animatedProps,
          ...interop.transitionProps,
        ].join(":");
      } else {
        interop.animationInteropKey = undefined;
      }

      if (requiresLayout) {
        styledProps.onLayout = (event: LayoutChangeEvent) => {
          props.onLayout?.(event);
          const layout = event.nativeEvent.layout;
          interop.setInteraction("layoutWidth", layout.width);
          interop.setInteraction("layoutHeight", layout.height);
        };
      }

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
        };
      }

      interop.signals = new Map([
        ...parent.signals,
        ...universalVariables,
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
