import { useContext, useEffect, useRef, useSyncExternalStore } from "react";
import {
  Effect,
  Signal,
  createEffect,
  createSignal,
  reactGlobal,
} from "../signals";
import { NormalizedOptions } from "./prop-mapping";
import { fastReloadSignal } from "./stylesheet";
import {
  ColorSchemeSignal,
  createColorSchemeSignal,
  effectContext,
  rootVariables,
  universalVariables,
} from "./inheritance";
import { processStyles } from "./process-styles";
import { ExtractedStyleValue, GetInteraction, Interaction } from "../../types";

/**
 * The InteropEffect is a special effect that is used to track
 *   - signal dependencies
 *   - parent InteropEffect
 *   - props
 *
 * If any of these change, the effect will re-run.
 *
 * If the InteropEffect has:
 *  - inline variables
 *  - a container name
 *  - a group name
 *
 * Then the effect will be saved in React Context and accessible to child components.
 *
 * TODO: As InteropEffects also store all inheritable dynamic information for their subtree (variables/containers)
 * they also provide a shareable cache for styles
 */
export interface InteropEffect extends Effect {
  run(props: Record<string, unknown>, parent: InteropEffect): void;
  // tracking
  props: Record<string, unknown>;
  parent: InteropEffect | null;
  lastDependencies: unknown[];
  lastVersion: number;
  // Rendering
  styledProps: Record<string, unknown>;
  contextValue?: InteropEffect;
  shouldUpdateContext: boolean;
  shouldAddContext: boolean;
  // variables
  inlineVariables: Map<string, Signal<ExtractedStyleValue>>;
  inheritedVariables: Map<string, Signal<ExtractedStyleValue>>;
  variablesToClear: Set<string>;
  trackedVariables: Map<string, Signal<ExtractedStyleValue>>;
  getVariable: (name: string) => ExtractedStyleValue;
  setVariable: (name: string, value: ExtractedStyleValue) => void;
  // containers
  inlineContainers: Map<string, Signal<InteropEffect>>;
  inheritedContainers: Map<string, Signal<InteropEffect>>;
  containersToClear: Set<string>;
  trackedContainers: Map<string, Signal<InteropEffect>>;
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
  requiresLayout: boolean;
}

export function useInteropEffect(
  props: Record<string, unknown>,
  options: NormalizedOptions<Record<string, unknown>>,
) {
  const inheritance = useContext(effectContext);

  // Create a single store per component
  const effectRef = useRef<InteropEffect>();
  if (effectRef.current === null) {
    effectRef.current = createInteropEffect(
      options,
      inheritance,
      (props as any).testID,
    );
  }

  const effect = effectRef.current!;

  // Run the effect and subscribe to it
  effect.run(props, inheritance);
  useSyncExternalStore(
    effect.subscribe,
    effect.getSnapshot,
    effect.getSnapshot,
  );

  // If we unmount we need to cleanup the store's subscribers
  useEffect(() => effect.cleanup, []);

  // If there are any delayedEffects, run them
  // TODO: This could be improved...
  useEffect(() => {
    if (reactGlobal.delayedEvents.size) {
      for (const sub of reactGlobal.delayedEvents) {
        sub();
      }
      reactGlobal.delayedEvents.clear();
    }
  });

  return {
    effect,
    animationInteropKey: "",
    contextValue: effect.contextValue,
    styledProps: {},
    convertToPressable: false,
  };
}

export function createInteropEffect(
  options: NormalizedOptions<Record<string, unknown>>,
  initialParent: InteropEffect,
  debugName?: string,
) {
  const interaction: Interaction = {};

  const effect: InteropEffect = Object.assign(createEffect(debugName), {
    parent: initialParent,
    props: {},
    styledProps: {},
    lastDependencies: [],
    lastVersion: 0,
    requiresLayout: false,
    inheritedVariables: new Map(),
    inlineVariables: new Map(),
    inlineContainers: new Map(),
    inheritedContainers: new Map(),
    variablesToClear: new Set(),
    containersToClear: new Set(),
    trackedVariables: new Map(),
    trackedContainers: new Map(),
    transitionProps: new Set(),
    animatedProps: new Set(),
    shouldUpdateContext: false,
    shouldAddContext: false,
    run(props, parent) {
      const currentInheritedVariables = new Map([
        ...parent.inheritedVariables,
        ...universalVariables,
        ...parent.inlineVariables,
      ]);

      const currentInheritedContainers = new Map([
        ...parent.inheritedContainers,
        ...parent.inlineContainers,
      ]);

      // We should update if....
      let shouldRun =
        // The version was updated
        effect.version !== effect.lastVersion ||
        // The effect is waiting to be run
        reactGlobal.delayedEvents.has(effect) ||
        // The prop dependencies have changed
        options.dependencies.length !== effect.lastDependencies.length ||
        options.dependencies.some((k, index) => {
          return props![k] !== effect.lastDependencies[index];
        }) ||
        // The tracked variables have changed
        Array.from(effect.trackedVariables).some((tracked) => {
          return currentInheritedVariables.get(tracked[0]) !== tracked[1];
        }) ||
        // The tracked containers have changed
        Array.from(effect.trackedContainers).some((tracked) => {
          return currentInheritedContainers.get(tracked[0]) !== tracked[1];
        });

      if (!shouldRun) {
        return;
      }

      // Update the tracking
      effect.lastVersion = effect.version;
      reactGlobal.delayedEvents.delete(effect);
      effect.lastDependencies = options.dependencies.map((k) => props![k]);
      effect.parent = parent;
      effect.inheritedVariables = currentInheritedVariables;
      effect.inheritedContainers = currentInheritedContainers;
      effect.requiresLayout = false;
      effect.animationInteropKey = undefined;

      effect.setup(); // Setup the signal effect tracking
      // Track if we need to update the context. We try to avoid this if possible
      effect.shouldUpdateContext = false;
      // These will be updated in the "getVariables" and "getContainers" functions
      effect.variablesToClear = new Set(effect.inlineVariables.keys());
      effect.containersToClear = new Set(effect.inlineContainers.keys());

      // Listen for fast-reload
      // TODO: This should be improved...
      fastReloadSignal.get();

      processStyles(props, effect, options);

      /**
       * Clear any variables that were not used.
       *
       * We do this by setting them to undefined, which will cause the effects to re-run.
       * Then we remove them from inheritance, so they are no present when the effects run
       *
       * Note: we don't need to worry about garbage collection, as the effects
       *   will remove themselves from the signal when they re-run, leaving no references
       */
      effect.shouldUpdateContext ||=
        effect.variablesToClear.size > 0 || effect.containersToClear.size > 0;
      for (const variable of effect.variablesToClear) {
        effect.inlineVariables.get(variable)?.set(undefined);
        effect.inlineVariables.delete(variable);
      }
      for (const container of effect.containersToClear) {
        effect.inlineContainers.get(container)?.set(undefined);
        effect.inlineContainers.delete(container);
      }

      if (this.shouldUpdateContext) {
        // Duplicate this object, making it identify different
        effect.contextValue = Object.assign({}, effect);
      }

      // Stop the effect
      effect.teardown();
    },
    setVariable(name, value) {
      let signal = effect.inlineVariables.get(name);

      if (!signal) {
        signal = createSignal(value);
        effect.shouldUpdateContext = true;
        effect.inlineVariables.set(name, signal);
      } else {
        signal.set(value);
      }

      effect.variablesToClear.delete(name);
    },
    getVariable(name) {
      // Try the inline variables
      let signal: Signal<any> | undefined = effect.inlineVariables.get(name);

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
      signal = effect.inheritedVariables.get(name);
      if (signal) {
        value = signal.get();
        if (value !== undefined) {
          effect.trackedVariables.set(name, signal);
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

      effect.trackedVariables.set(name, signal);
      return signal.get();
    },
    setContainer(name) {
      let signal = effect.inlineContainers.get(name);

      if (!signal) {
        signal = createSignal(effect);
        effect.shouldUpdateContext = true;
        effect.inlineContainers.set(name, signal);
      }

      effect.containersToClear.delete(name);
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
      if ("name" in interaction) {
        interaction[name]!.set(value as any);
      } else {
        interaction[name] = createSignal(value) as any;
      }
    },
  } satisfies Omit<InteropEffect, keyof Effect>);

  return effect;
}
