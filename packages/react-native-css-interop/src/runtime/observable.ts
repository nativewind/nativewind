export type Effect = {
  rerun: (isRendering?: boolean) => void;
  dependencies: Set<() => void>;
};

export type Observable<T> = {
  name?: string;
  get(effect?: Effect): T;
  set(newValue: T, notify?: boolean): void;
};

export type ObservableOptions<T> = {
  fallback?: Observable<T>;
  name?: string;
};

export function observable<T>(
  value: T,
  { fallback, name }: ObservableOptions<T> = {},
): Observable<T> {
  const subscriptions = new Set<() => void>();

  return {
    name,
    get(effect) {
      if (effect) {
        subscriptions.add(effect.rerun);
        effect.dependencies.add(() => subscriptions.delete(effect.rerun));
      }
      return value ?? fallback?.get(effect)!;
    },

    set(newValue: any) {
      if (Object.is(newValue, value)) return;
      value = newValue;
      // We need to copy the subscriptions as new ones may be added during the render, causing an infinite growing subscriptions set
      for (const sub of [...subscriptions]) {
        sub();
      }
    },
  };
}

export function cleanupEffect(effect: Effect) {
  for (const dep of effect.dependencies) {
    dep();
  }
  effect.dependencies.clear();
}
