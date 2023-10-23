import { useEffect, useRef, useSyncExternalStore } from "react";

export const reactGlobal: {
  isInComponent: boolean;
  currentStore: Computed<any> | null;
  delayedEvents: Set<() => void>;
} = {
  isInComponent: false,
  currentStore: null,
  delayedEvents: new Set(),
};

const context: Computed<any>[] = [];

export type Signal<T> = ReturnType<typeof createSignal<T>>;
type SignalSetFn<T> = (previous?: T) => T;

export function createSignal<T = unknown>(value: T | undefined, id?: string) {
  const signal = {
    subscriptions: new Set<(() => void) | Computed<any>>(),
    /**
     * Get the value and subscribe if we are in an effect
     */
    get() {
      const running = context[context.length - 1];
      if (running) {
        // console.log("get", id, running.id);
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
    set(nextValue: T | undefined | SignalSetFn<T>) {
      if (typeof nextValue === "function") {
        nextValue = (nextValue as any)(value);
      }

      if (Object.is(value, nextValue)) return;
      value = nextValue as T;
      // console.log("set", id);
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

export interface Computed<T = unknown> extends Signal<T> {
  (): void;
  dependencies: Set<Signal<any>>;
  fn: SignalSetFn<T>;
  runInEffect<T>(fn: () => T): T;
}

function setup(effect: Computed<any>) {
  // Clean up the previous run
  cleanupEffect(effect);
  // Setup the new run
  context.push(effect);
  reactGlobal.delayedEvents.delete(effect);
  reactGlobal.currentStore = effect;
}

function teardown(_effect: Computed<any>) {
  context.pop();
}

export function cleanupEffect(effect: Computed<any>) {
  for (const dep of effect.dependencies) {
    if ("subscriptions" in dep) {
      dep.subscriptions.delete(effect);
    }
  }
  effect.dependencies.clear();
  reactGlobal.delayedEvents.delete(effect);
}

export function createComputed<T>(
  fn: SignalSetFn<T>,
  runOnInitialization = true,
  id?: string,
): Computed<T> {
  const effect: Computed<T> = Object.assign(
    function () {
      setup(effect);
      effect.set(effect.fn);
      teardown(effect);
    },
    createSignal<T>(undefined, id),
    {
      dependencies: new Set(),
      fn: fn,
      /**
       * Run a function in context, without cleaning up the dependencies
       */
      runInEffect<T>(fn: () => T) {
        context.push(effect);
        let value = fn();
        context.pop();
        return value;
      },
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
export function useComputed<T>(fn: () => T, fnDependency?: any) {
  reactGlobal.isInComponent = true;
  const computedRef = useRef<Computed<T> & { fnDependency: any }>();

  useEffect(() => {
    if (reactGlobal.delayedEvents.size) {
      for (const sub of reactGlobal.delayedEvents) {
        sub();
      }
      reactGlobal.delayedEvents.clear();
    }
  });

  if (computedRef.current == null) {
    computedRef.current = Object.assign(createComputed<T>(fn), {
      fnDependency,
    });
  } else if (computedRef.current.fnDependency !== fnDependency) {
    computedRef.current.fn = fn;
    computedRef.current();
  }

  return useSyncExternalStore(
    computedRef.current.subscribe,
    computedRef.current.peek,
    computedRef.current.peek,
  );
}
