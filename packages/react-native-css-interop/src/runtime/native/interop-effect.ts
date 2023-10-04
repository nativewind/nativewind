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
 * they can provide a shareable cache for styles
 */
export interface InteropEffect extends Effect {
  run(props: Record<string, unknown>, parent: InteropEffect): void;
  // tracking
  props: Record<string, unknown>;
  parent: InteropEffect;
  lastDependencies: unknown[];
  lastVersion: number;
  // Rendering
  styledProps: Record<string, unknown>;
  contextValue?: InteropEffect;
  shouldUpdateContext: boolean;
  convertToPressable: boolean;
  requiresLayout: boolean;
  // variables
  inlineVariables: Map<string, Signal<ExtractedStyleValue>>;
  inheritedVariables: Map<string, Signal<ExtractedStyleValue>>;
  variablesSetDuringRender: Set<string>;
  variablesAccessedDuringRender: Map<string, Signal<ExtractedStyleValue>>;
  getVariable: (name: string) => ExtractedStyleValue;
  setVariable: (name: string, value: ExtractedStyleValue) => void;
  // containers
  containerSignal?: Signal<InteropEffect>;
  inheritedContainers: Map<string, Signal<InteropEffect>>;
  inlineContainers: Map<string, Signal<InteropEffect>>;
  containerNamesSetDuringRender: Set<string>;
  containersAccessedDuringRender: Map<string, Signal<InteropEffect>>;
  getContainer: (name: string) => InteropEffect | undefined;
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

export function useInteropEffect(
  props: Record<string, unknown>,
  options: NormalizedOptions<Record<string, unknown>>,
) {
  const inheritance = useContext(effectContext);

  // Create a single store per component
  const effectRef = useRef<InteropEffect>();
  if (!effectRef.current) {
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

  return effect;
}

export function createInteropEffect(
  options: NormalizedOptions<Record<string, unknown>>,
  initialParent: InteropEffect,
  debugName?: string,
) {
  const interaction: Interaction = {};

  const effect: InteropEffect = Object.assign(createEffect(debugName), {
    props: {},
    // tracking
    parent: initialParent,
    lastDependencies: [],
    lastVersion: 0,
    // rendering
    styledProps: {},
    shouldUpdateContext: false,
    requiresLayout: false,
    convertToPressable: false,
    // variables
    inlineVariables: new Map(),
    inheritedVariables: new Map(),
    variablesSetDuringRender: new Set(),
    variablesAccessedDuringRender: new Map(),
    // containers
    inlineContainers: new Map(),
    inheritedContainers: new Map(),
    containerNamesSetDuringRender: new Set(),
    containersAccessedDuringRender: new Map(),
    // animations
    animatedProps: new Set(),
    transitionProps: new Set(),
    run(props, parent) {
      effect.inheritedVariables = new Map([
        ...parent.inheritedVariables,
        ...universalVariables,
        ...parent.inlineVariables,
      ]);

      effect.inheritedContainers = new Map([
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
        // A variable we accessed has changed to a new signal
        Array.from(effect.variablesAccessedDuringRender).some(
          ([name, signal]) => {
            return signal !== effect.inheritedVariables.get(name);
          },
        ) ||
        // A container we accessed has changed to a new signal
        Array.from(effect.containersAccessedDuringRender).some(
          ([name, signal]) => {
            return signal !== effect.inheritedContainers.get(name);
          },
        );

      if (!shouldRun) {
        return;
      }

      // Update the tracking
      effect.lastVersion = effect.version;
      reactGlobal.delayedEvents.delete(effect);
      effect.lastDependencies = options.dependencies.map((k) => props![k]);
      effect.parent = parent;
      effect.requiresLayout = false;
      effect.animationInteropKey = undefined;

      effect.setup(); // Setup the signal effect tracking
      effect.shouldUpdateContext = false;
      // Track variables set/accessed during render
      effect.variablesSetDuringRender.clear();
      effect.variablesAccessedDuringRender.clear();
      // Track containers set/accessed during render
      effect.containerNamesSetDuringRender.clear();
      effect.containersAccessedDuringRender.clear();

      // Listen for fast-reload
      // TODO: This should be improved...
      fastReloadSignal.get();

      /**
       * Sets these attributes on the effect
       *  - styledProps
       *  - convertToPressable
       *  - animationInteropKey
       *  - transitionProps
       *  - animatedProps
       */
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
        effect.inlineVariables.size !== effect.variablesSetDuringRender.size;
      for (const variable of effect.inlineVariables.keys()) {
        if (!effect.variablesSetDuringRender.has(variable)) {
          effect.inlineVariables.delete(variable);
          effect.shouldUpdateContext = true;
        }
      }

      effect.shouldUpdateContext ||=
        effect.inheritedContainers.size !==
        effect.containerNamesSetDuringRender.size;
      for (const container of effect.inlineContainers.keys()) {
        if (
          container !== "__default" &&
          !effect.containerNamesSetDuringRender.has(container)
        ) {
          effect.inlineContainers.delete(container);
          effect.shouldUpdateContext = true;
        }
      }

      if (effect.shouldUpdateContext) {
        // Duplicate this object, making it identify different
        effect.contextValue = Object.assign({}, effect);
      }

      // Stop the effect
      effect.teardown();
    },
    setVariable(name, value) {
      effect.variablesSetDuringRender.add(name);

      let signal = effect.inlineVariables.get(name);

      if (!signal) {
        signal = createSignal(value);
        effect.shouldUpdateContext = true;
        effect.inlineVariables.set(name, signal);
      } else {
        signal.set(value);
      }
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
          effect.variablesAccessedDuringRender.set(name, signal);
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

      effect.variablesAccessedDuringRender.set(name, signal);
      return signal.get();
    },
    getContainer(name) {
      const signal = effect.inheritedContainers.get(name);
      if (signal) {
        effect.containersAccessedDuringRender.set(name, signal);
        return signal.get();
      }
    },
    setContainer(name) {
      effect.containerNamesSetDuringRender.add(name);
      effect.containerSignal ??= createSignal(effect);
      effect.inlineContainers.set(name, effect.containerSignal);
      effect.inlineContainers.set("__default", effect.containerSignal);
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
  } satisfies Omit<InteropEffect, keyof Effect>);

  return effect;
}
