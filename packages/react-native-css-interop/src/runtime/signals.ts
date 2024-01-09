import { useReducer, useEffect } from "react";

export const interopGlobal: {
  delayUpdates: boolean;
  current: Effect | null;
  delayedEvents: Set<() => void>;
} = {
  delayUpdates: false,
  current: null,
  delayedEvents: new Set(),
};

export const context: Effect[] = [];

export type Signal<T> = ReturnType<typeof createSignal<T>>;
type SignalSetFn<T> = (previous?: T) => T;

export type Effect = {
  (): void;
  id?: string;
  dependencies: Set<Signal<any>>;
};

export function createSignal<T = unknown>(value: T, id?: string) {
  const signal = {
    subscriptions: new Set<(() => void) | Computed<any>>(),
    /**
     * Get the value and subscribe if we are in an effect
     */
    get() {
      const running = context[context.length - 1];
      if (running) {
        // console.log("subscribe", running.id, " to ", id);
        signal.subscriptions.add(running);
        running.dependencies.add(signal);
      }
      return value;
    },
    id,
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
    set(nextValue: T | undefined | SignalSetFn<T>, notify = true) {
      if (typeof nextValue === "function") {
        nextValue = (nextValue as any)(value);
      }

      if (Object.is(value, nextValue)) return;
      value = nextValue as T;
      // console.log("set", id, value);
      if (notify) {
        if (interopGlobal.delayUpdates) {
          for (const sub of signal.subscriptions) {
            interopGlobal.delayedEvents.add(sub);
          }
        } else {
          for (const sub of Array.from(signal.subscriptions)) {
            sub();
          }
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

export interface Computed<T = unknown> extends Signal<T> {
  (): void;
  dependencies: Set<Signal<any>>;
  fn: SignalSetFn<T>;
}

export function setupEffect<T extends Effect>(effect: T) {
  // Clean up the previous run
  cleanupEffect(effect);
  // Setup the new run
  context.push(effect);
  interopGlobal.delayedEvents.delete(effect);
  interopGlobal.current = effect;
}

export function teardownEffect(_effect: Effect) {
  context.pop();
  interopGlobal.current = null;
}

export function cleanupEffect(effect: Effect) {
  for (const dep of effect.dependencies) {
    if ("subscriptions" in dep) {
      // console.log("remove", effect.id, "from", dep.id);
      dep.subscriptions.delete(effect);
    }
  }
  effect.dependencies.clear();
  interopGlobal.delayedEvents.delete(effect);
}

export function createComputed<T>(
  fn: SignalSetFn<T>,
  {
    initialValue,
    runOnInitialization = true,
    id,
  }: {
    initialValue?: T;
    runOnInitialization?: boolean;
    id?: string;
  } = {},
): Computed<T> {
  const effect: Computed<T> = Object.assign(
    function () {
      setupEffect(effect);
      effect.set(effect.fn);
      teardownEffect(effect);
    },
    createSignal<T>(initialValue as T, id),
    {
      dependencies: new Set(),
      fn: fn,
    } satisfies {
      [K in keyof Omit<Computed, keyof Signal<any>>]: Computed<T>[K];
    },
  );
  if (runOnInitialization) {
    effect();
  }
  return effect;
}

/*
 * We only ever track one dependency
 */
export function useComputed<T>(fn: () => T, dependency?: any) {
  const [{ computed, dependency: lastDependency }, dispatch] = useReducer(
    (
      state: { computed: Computed<T>; dependency?: any },
      action: { computed?: Computed<T>; dependency?: any },
    ) => {
      return { ...state, ...action };
    },
    undefined,
    () => {
      return {
        computed: createComputed<T>(fn),
        dependency,
      };
    },
  );

  useEffect(() => {
    const sub = computed.subscribe(() => {
      dispatch({});
    });
    return () => sub();
  }, [computed]);

  useEffect(() => {
    if (interopGlobal.delayedEvents.size) {
      for (const sub of interopGlobal.delayedEvents) {
        sub();
      }
      interopGlobal.delayedEvents.clear();
    }
  });

  if (dependency != lastDependency) {
    dispatch({
      computed: createComputed(fn),
      dependency,
    });
  }

  return computed.peek();
}
