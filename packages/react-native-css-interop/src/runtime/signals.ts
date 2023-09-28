import { useRef, useSyncExternalStore } from "react";

export const reactGlobal: {
  isInComponent: boolean;
  currentStore: EffectStore | null;
  delayedEffects: Set<() => void>;
  shouldRerender: Set<() => void>;
} = {
  isInComponent: false,
  currentStore: null,
  delayedEffects: new Set(),
  shouldRerender: new Set(),
};

export type Signal<T> = ReturnType<typeof createSignal<T>>;

export function createSignal<T = unknown>(value: T) {
  const signal = {
    subscriptions: new Set<() => void>(),
    get() {
      const running = context[context.length - 1];
      if (running) {
        signal.subscriptions.add(running);
        running.dependencies.add(signal);
      }
      return value;
    },
    peek() {
      return value;
    },
    set(nextValue: T) {
      console.log(nextValue, signal.subscriptions.size);
      if (Object.is(value, nextValue)) return;
      value = nextValue;
      if (reactGlobal.isInComponent) {
        for (const sub of signal.subscriptions) {
          reactGlobal.shouldRerender.add(sub);
          reactGlobal.delayedEffects.add(sub);
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

export type EffectStore<T = unknown> = {
  (): void;
  version: number;
  dependencies: Set<Signal<any>>;
  getSnapshot(): T;
  runInEffect<T>(fn: () => T): T;
  subscribe(callback: () => void): () => void;
  cleanup: () => void;
};

const context: EffectStore[] = [];
export function createEffectStore(debugName?: string) {
  let subscription: () => void | undefined;

  const store: EffectStore = Object.assign(
    function () {
      store.version++;
      subscription?.();
    },
    {
      debugName,
      version: 0,
      getSnapshot() {
        return store.version;
      },
      dependencies: new Set<Signal<any>>(),
      runInEffect<T>(fn: () => T): T {
        context.push(store);
        let value = fn();
        context.pop();
        return value;
      },
      subscribe(callback: () => void) {
        subscription = callback;
        return () => {
          subscription === undefined;
        };
      },
      cleanup() {
        for (const dep of store.dependencies) {
          dep.subscriptions.delete(store);
        }
        store.dependencies.clear();
        reactGlobal.shouldRerender.delete(store);
        reactGlobal.delayedEffects.delete(store);
      },
    },
  );

  return store;
}

export function setupStore(store: EffectStore) {
  context.push(store);
  reactGlobal.delayedEffects.delete(store);
  reactGlobal.currentStore = store;
  store.cleanup();
}

export function teardownStore() {
  context.pop();
}

export function useSignals() {
  if (reactGlobal.currentStore) {
    return reactGlobal.currentStore;
  }

  teardownStore();

  const storeRef = useRef<EffectStore>();
  if (storeRef.current == null) {
    storeRef.current = createEffectStore();
  }

  const store = storeRef.current;
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  setupStore(store);

  return store;
}
