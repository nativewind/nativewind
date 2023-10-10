import { useContext, useEffect, useRef, useSyncExternalStore } from "react";
import {
  Computed as Computed,
  Signal,
  cleanup,
  createComputed,
  createSignal,
  reactGlobal,
} from "../signals";
import { NormalizedOptions } from "./prop-mapping";
import { fastReloadSignal, StyleSheet, getGlobalStyle } from "./stylesheet";
import {
  ColorSchemeSignal,
  createColorSchemeSignal,
  effectContext,
  rootVariables,
  universalVariables,
} from "./inheritance";
import {
  ExtractedStyleValue,
  GetInteraction,
  Interaction,
  Style,
  StyleProp,
} from "../../types";
import { styleMetaMap } from "./misc";
import { styleSpecificityCompareFn } from "../specificity";
import { flattenStyle } from "./flatten-style";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TargetedEvent,
} from "react-native";

/**
 * TODO:
 *  - Current, if anything changes we will always generate new styles
 *      If this incorrect, as we should check if that actual styles have changed from the previous
 *      fn() is called with the previous prop, we just don't use it.
 *      Maybe each style should be calculated in its own computed?
 *  - We have a mix of properties on the Interop and off it, we should standardize
 *  - Can tracking be done in a more performant way?
 *  - Need to add caching for styles.
 */
export interface InteropComputed extends Computed<any> {
  shouldUpdate(
    parent: InteropComputed,
    props: Record<string, unknown>,
  ): boolean;
  // tracking
  props: Record<string, unknown>;
  parent: InteropComputed;
  lastDependencies: unknown[];
  lastVersion: number;
  // Rendering
  styledProps: Record<string, unknown>;
  contextValue?: InteropComputed;
  shouldUpdateContext: boolean;
  convertToPressable: boolean;
  requiresLayout: boolean;
  // variables
  variables: Map<string, Signal<ExtractedStyleValue>>;
  getVariable: (name: string) => ExtractedStyleValue;
  setVariable: (name: string, value: ExtractedStyleValue) => void;
  hasVariable: (name: string) => boolean;
  // containers
  containers: Map<string, Signal<InteropComputed>>;
  getContainer: (name: string) => InteropComputed | undefined;
  setContainer: (name: string) => void;
  // interaction
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
  } else if (interopRef.current.shouldUpdate(parent, props)) {
    interopRef.current.props = props;
    interopRef.current.parent = parent;
    interopRef.current();
  }

  const interop = interopRef.current;

  /**
   * Always run the effect so it can test the props/parent
   */

  // If we unmount we need to cleanup the store's subscribers
  useEffect(() => () => cleanup(interop), []);

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

  // variables
  const inlineVariables = new Map();
  const variablesSetDuringRender = new Set();
  const variablesAccessedDuringRender = new Map();
  // containers
  const inlineContainers = new Map();
  const containerNamesSetDuringRender = new Set();
  const containersAccessedDuringRender = new Map();
  let containerSignal: Signal<InteropComputed> | undefined;

  let partialInterop: Omit<
    InteropComputed,
    Exclude<keyof Computed<any>, "fn">
  > = {
    // tracking
    props,
    parent,
    lastDependencies: [],
    lastVersion: 0,
    // rendering
    styledProps: {},
    shouldUpdateContext: false,
    requiresLayout: false,
    convertToPressable: false,
    // animations
    animatedProps: new Set(),
    transitionProps: new Set(),
    // variables
    variables: new Map(),
    setVariable(name, value) {
      variablesSetDuringRender.add(name);

      let signal = inlineVariables.get(name);

      if (!signal) {
        signal = createSignal(value);
        interop.shouldUpdateContext = true;
        inlineVariables.set(name, signal);
      } else {
        signal.set(value);
      }
    },
    getVariable(name) {
      // Try the inline variables
      let signal: Signal<any> | undefined = inlineVariables.get(name);

      let value = signal?.get();
      if (value !== undefined) return value;

      // Try the universal variables
      signal = universalVariables.get(name);
      if (!signal) {
        signal = createColorSchemeSignal();
        universalVariables.set(name, signal as ColorSchemeSignal);
        signal.get();
      } else {
        value = signal.get();
        if (value !== undefined) return value;
      }

      // Try the inherited variables
      signal = parent.variables.get(name);
      if (signal) {
        value = signal.get();
        if (value !== undefined) {
          variablesAccessedDuringRender.set(name, signal);
          return value;
        }
      }

      // Try the root variables?
      signal = rootVariables.get(name);
      if (!signal) {
        // The root signal didn't exist, so create it.
        signal = createColorSchemeSignal();
        rootVariables.set(name, signal as ColorSchemeSignal);
        // Also subscribe to it, incase fast-refresh adds a value
      }

      variablesAccessedDuringRender.set(name, signal);
      return signal.get();
    },
    hasVariable(name) {
      return variablesAccessedDuringRender.has(name);
    },
    // containers
    containers: new Map(),
    getContainer(name) {
      const signal = parent.containers.get(name);
      if (signal) {
        containersAccessedDuringRender.set(name, signal);
        return signal.get();
      }
    },
    setContainer(name) {
      containerNamesSetDuringRender.add(name);
      containerSignal ??= createSignal(interop as InteropComputed);
      inlineContainers.set(name, containerSignal);
      inlineContainers.set("__default", containerSignal);
    },
    getInteraction(name) {
      if (!interaction[name]) {
        if (name === "layoutWidth" || name === "layoutHeight") {
          interaction[name] = createSignal(0) as any;
        } else {
          interaction[name] = createSignal(false) as any;
        }
      }

      return interaction[name]!;
    },
    setInteraction(name, value) {
      if (name in interaction) {
        interaction[name]!.set(value as any);
      } else {
        interaction[name] = createSignal(value) as any;
      }
    },
    shouldUpdate(parent, props) {
      return Boolean(
        options.dependencies.some(
          (k, i) => props[k] !== interop.lastDependencies[i],
        ) ||
          // A variable we accessed has changed to a new signal
          (variablesAccessedDuringRender.size &&
            Array.from(variablesAccessedDuringRender).some(([name, signal]) => {
              return signal !== parent.variables.get(name);
            })) ||
          // A container we accessed has changed to a new signal
          (containersAccessedDuringRender.size &&
            Array.from(containersAccessedDuringRender).some(
              ([name, signal]) => {
                return signal !== parent.containers.get(name);
              },
            )),
      );
    },
    fn() {
      const props = interop.props;
      // Update the tracking
      reactGlobal.delayedEvents.delete(interop as InteropComputed);
      interop.lastDependencies = options.dependencies.map((k) => props![k]);
      interop.requiresLayout = false;
      interop.animationInteropKey = undefined;
      interop.shouldUpdateContext = false;

      // Track variables set/accessed during render
      variablesSetDuringRender.clear();
      variablesAccessedDuringRender.clear();

      // Track containers set/accessed during render
      containerNamesSetDuringRender.clear();
      containersAccessedDuringRender.clear();

      // Listen for fast-reload
      // TODO: This should be improved...
      fastReloadSignal.get();

      const styledProps: Record<string, unknown> = {};
      interop.styledProps = styledProps;
      interop.animatedProps.clear();
      interop.transitionProps.clear();

      let hasActive: boolean | undefined = false;
      let hasHover: boolean | undefined = false;
      let hasFocus: boolean | undefined = false;
      let requiresLayout = false;

      let dynamicStyles = false;

      for (const [key, { sources, nativeStyleToProp }] of options.config) {
        dynamicStyles ||= Boolean(nativeStyleToProp);

        const prop = props[key] as StyleProp;
        let stylesToFlatten: StyleProp = [];
        if (prop) stylesToFlatten.push(prop);

        for (const sourceProp of sources) {
          const source = props?.[sourceProp];
          if (typeof source !== "string") continue;

          StyleSheet.unstable_hook_onClassName?.(source);

          for (const className of source.split(/\s+/)) {
            let styles = getGlobalStyle(className);
            if (!styles) continue;

            if (!Array.isArray(styles)) {
              styles = [styles];
            }

            for (const style of styles) {
              stylesToFlatten.push(style);
            }
          }
        }

        dynamicStyles ||= stylesToFlatten.some((s) => s && styleMetaMap.has(s));

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

        const style = flattenStyle(stylesToFlatten, interop as InteropComputed);
        const meta = styleMetaMap.get(style);

        const hasInlineContainers = containerNamesSetDuringRender.size > 0;

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

          requiresLayout ||= Boolean(
            hasInlineContainers || meta.requiresLayout,
          );
          hasActive ||= Boolean(
            hasInlineContainers || meta.pseudoClasses?.active,
          );
          hasHover ||= Boolean(
            hasInlineContainers || meta.pseudoClasses?.hover,
          );
          hasFocus ||= Boolean(
            hasInlineContainers || meta.pseudoClasses?.focus,
          );
        }

        /**
         * Map the flatStyle to the correct prop and/or move style properties to props (nativeStyleToProp)
         *
         * Note: We freeze the flatStyle as many of its props are getter's without a setter
         *  Freezing the whole object keeps everything consistent
         */
        if (nativeStyleToProp) {
          for (const [key, targetProp] of Object.entries(nativeStyleToProp)) {
            const styleKey = key as keyof Style;
            if (targetProp === true && style[styleKey]) {
              styledProps[styleKey] = style[styleKey];
              delete style[styleKey];
            }
          }
        }

        styledProps[key] = Object.freeze(style);
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
          (props as any).onLayout?.(event);
          interop.setInteraction("layoutWidth", event.nativeEvent.layout.width);
          interop.setInteraction(
            "layoutHeight",
            event.nativeEvent.layout.height,
          );
        };
      }

      let convertToPressable = false;
      if (hasActive) {
        convertToPressable = true;
        styledProps.onPressIn = (event: GestureResponderEvent) => {
          (props as any).onPressIn?.(event);
          interop.setInteraction("active", true);
        };
        styledProps.onPressOut = (event: GestureResponderEvent) => {
          (props as any).onPressOut?.(event);
          interop.setInteraction("active", false);
        };
      }
      if (hasHover) {
        convertToPressable = true;
        styledProps.onHoverIn = (event: MouseEvent) => {
          (props as any).onHoverIn?.(event);
          interop.setInteraction("hover", true);
        };
        styledProps.onHoverOut = (event: MouseEvent) => {
          (props as any).onHoverIn?.(event);
          interop.setInteraction("hover", false);
        };
      }
      if (hasFocus) {
        convertToPressable = true;
        styledProps.onFocus = (event: NativeSyntheticEvent<TargetedEvent>) => {
          (props as any).onFocus?.(event);
          interop.setInteraction("focus", true);
        };
        styledProps.onBlur = (event: NativeSyntheticEvent<TargetedEvent>) => {
          (props as any).onBlur?.(event);
          interop.setInteraction("focus", false);
        };
      }

      if (convertToPressable) {
        styledProps.onPress = (event: GestureResponderEvent) => {
          (props as any).onPress?.(event);
        };
      }

      interop.styledProps = styledProps;
      interop.convertToPressable = convertToPressable;

      // processStyles(props, interop as InteropComputed, options);

      interop.containers = new Map([...parent.containers, ...inlineContainers]);
      interop.variables = new Map([
        ...parent.variables,
        ...universalVariables,
        ...inlineVariables,
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

      interop.shouldUpdateContext ||=
        inlineVariables.size !== variablesSetDuringRender.size;
      for (const variable of inlineVariables.keys()) {
        if (!variablesSetDuringRender.has(variable)) {
          inlineVariables.delete(variable);
          interop.shouldUpdateContext = true;
        }
      }

      interop.shouldUpdateContext ||=
        inlineContainers.size !== containerNamesSetDuringRender.size;
      for (const container of inlineContainers.keys()) {
        if (
          container !== "__default" &&
          !containerNamesSetDuringRender.has(container)
        ) {
          inlineContainers.delete(container);
          interop.shouldUpdateContext = true;
        }
      }

      if (interop.shouldUpdateContext) {
        // Duplicate this object, making it identify different
        interop.contextValue = Object.assign({}, interop as InteropComputed);
      }

      return { ...interop };
    },
  };

  const interop: InteropComputed = Object.assign(
    createComputed(partialInterop.fn, false),
    partialInterop,
  );

  interop();

  return interop;
}
