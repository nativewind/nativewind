import { useRef, useSyncExternalStore } from "react";

export const reactGlobal: {
  isInComponent: boolean;
  currentStore: Effect | null;
  delayedEvents: Set<() => void>;
} = {
  isInComponent: false,
  currentStore: null,
  delayedEvents: new Set(),
};

export type Signal<T> = ReturnType<typeof createSignal<T>>;

export function createSignal<T = unknown>(value: T | undefined) {
  const signal = {
    subscriptions: new Set<() => void>(),
    /**
     * Get the value and subscribe if we are in an effect
     */
    get() {
      const running = context[context.length - 1];
      if (running) {
        signal.subscriptions.add(running);
        running.dependencies.add(signal);
      }
      return value;
    },
    /**
     * Get the value without subscribing
     */
    peek() {
      return value;
    },
    /**
     * Set the value if it has changed and notify subscribers
     * If we are in a component, delay the update until the component is done rendering
     * as React cannot handle state updates during rendering
     */
    set(nextValue: T | undefined) {
      if (Object.is(value, nextValue)) return;
      value = nextValue;
      if (reactGlobal.isInComponent) {
        for (const sub of signal.subscriptions) {
          reactGlobal.delayedEvents.add(sub);
        }
      } else {
        for (const sub of Array.from(signal.subscriptions)) {
          sub();
        }
      }
    },
    subscribe(callback: () => void) {
      signal.subscriptions.add(callback);
      return () => signal.unsubscribe(callback);
    },
    unsubscribe(callback: () => void) {
      signal.subscriptions.delete(callback);
    },
  };

  return signal;
}

export type Effect<T = unknown> = {
  (): void;
  debugName?: string;
  version: number;
  dependencies: Set<Signal<any>>;
  getSnapshot(): T;
  setup(): void;
  teardown(): void;
  runInEffect<T>(fn: () => T): T;
  subscribe(callback: () => void): () => void;
  cleanup: () => void;
};

const context: Effect[] = [];
export function createEffect(debugName?: string) {
  let subscription: (() => void) | undefined;

  const effect: Effect = Object.assign(
    function () {
      effect.version++;
      subscription?.();
    },
    {
      debugName,
      version: 0,
      dependencies: new Set(),
      /**
       * The version will change if any of the dependencies change
       */
      getSnapshot() {
        return effect.version;
      },
      /**
       * Setup this effect to the be the global effect
       */
      setup() {
        context.push(effect);
        reactGlobal.delayedEvents.delete(effect);
        reactGlobal.currentStore = effect;
        effect.cleanup();
      },
      teardown() {
        context.pop();
      },
      /**
       * Run a function in the effect context
       * Don't run cleanup as we don't want to clear the subscriptions, just add to them
       */
      runInEffect<T>(fn: () => T) {
        context.push(effect);
        let value = fn();
        context.pop();
        return value;
      },
      /**
       * Effects should only have one subscription, either:
       *  - useComputedProps
       *  - useSignals (which only runs once)
       */
      subscribe(callback) {
        subscription = callback;
        return () => {
          subscription = undefined;
        };
      },
      /**
       * Remove all tracking of this effect
       */
      cleanup() {
        for (const dep of effect.dependencies) {
          dep.subscriptions.delete(effect);
        }
        effect.dependencies.clear();
        reactGlobal.delayedEvents.delete(effect);
      },
    } satisfies { [K in keyof Effect]: Effect[K] },
  );

  return effect;
}

export function useSignals() {
  // This hook should only run once.
  if (reactGlobal.currentStore) {
    return reactGlobal.currentStore;
  }

  // Clear the last context if present
  context.pop();

  const effectRef = useRef<Effect>();
  if (effectRef.current == null) {
    effectRef.current = createEffect();
  }
  // Sync with the effect
  useSyncExternalStore(
    effectRef.current.subscribe,
    effectRef.current.getSnapshot,
    effectRef.current.getSnapshot,
  );
  // Run the effect
  effectRef.current.setup();
}
