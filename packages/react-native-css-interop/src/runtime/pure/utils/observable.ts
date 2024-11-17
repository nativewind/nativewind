/********************************    Effect   *********************************/

/**
 * An effect can be used to subscribe to an observable.
 * When the observable changes, the effect will run.
 */
export type Effect = {
  dependencies: Set<Observable<any, any[]>>;
  run(): void;
  get<Value, Args extends unknown[]>(
    readable: Observable<Value, Args> | Mutable<Value, Args>,
  ): Value;
};

export function cleanupEffect(effect?: Effect) {
  if (!effect) return;
  for (const dep of effect.dependencies) {
    dep.remove(effect);
  }
  effect.dependencies.clear();
}

/******************************    Observable   *******************************/

/**
 * An observable is a value that when read by an effect, will subscribe
 * the effect to the observable.
 */
export type Observable<Value = unknown, Args extends unknown[] = never[]> = {
  // Get the current value of the observable. If you provide an Effect, it will be subscribed to the observable.
  get(effect?: Effect): Value;
  // Set the value and rerun all subscribed Effects
  set(...value: Args): void;
  // Remove the effect from the observable
  remove(effect: Effect): void;
  // Set, but add the effects to a batch to be run later
  batch(batch: Set<Effect>, ...value: Args): void;
};

type Read<Value> = (get: Getter) => Value;
type Write<Value, Args extends unknown[]> = (
  set: Setter,
  ...args: Args
) => Value;
type MutableWrite<Value, Args extends unknown[]> = (
  _: void,
  ...args: Args
) => Value;
type Equality<Value> = (left: Value, right: Value) => Boolean;
type Getter = <Value, Args extends unknown[]>(
  observable: Observable<Value, Args>,
) => Value;
type Setter = <Value, Args extends unknown[]>(
  observable: Observable<Value, Args>,
  ...args: Args
) => void;

export function observable<Value>(
  read: undefined,
  write: undefined,
  equality?: Equality<Value>,
): Observable<Value | undefined, [Value]>;
export function observable<Value, Args extends unknown[]>(
  read: undefined,
  write?: Write<Value, Args>,
  equality?: Equality<Value>,
): Observable<Value | undefined, Args>;
export function observable<Value, Args extends unknown[]>(
  read: Value | Read<Value>,
  write: Write<Value, Args>,
  equality?: Equality<Value>,
): Observable<Value, Args>;
export function observable<Value>(
  read: Value | Read<Value>,
): Observable<Value, [Value]>;
export function observable<Value>(): Observable<
  Value | undefined,
  [Value | undefined]
>;
export function observable<Value, Args extends unknown[]>(
  read?: Value | Read<Value>,
  write?: Write<Value, Args>,
  equality: Equality<Value> = Object.is,
): Observable<Value, Args> {
  const effects = new Set<Effect>();

  let value: Value | undefined;
  let init = false;

  const isReadOnly = typeof read === "function" && !write;

  const obs: Observable<Value, Args> = {
    get(effect) {
      /**
       * Observables with read functions are lazy and only run the read function once.
       *
       * We also need to re-run the read function if this is a new effect
       * to ensure that the effect is subscribed to this observable's dependents.
       */
      if (!init || (effect && read && !effects.has(effect))) {
        init = true;
        value =
          typeof read === "function"
            ? (read as Read<Value>)((observable) => observable.get(effect))
            : read;
      }

      /**
       * Subscribe the effect to the observable if it is not read-only.
       */
      if (effect && !isReadOnly) {
        effects.add(effect);
        effect.dependencies.add(obs);
      }

      return value as Value;
    },
    /**
     * Sets the value of the observable and immediately runs all subscribed effects.
     * If you are setting multiple observables in succession, use batch() instead.
     */
    set(...args) {
      const nextValue =
        typeof write === "function"
          ? write(
              (observable, ...args) => {
                return observable.set(...args);
              },
              ...(args as Args),
            )
          : (args[0] as Value);

      if (equality(value as Value, nextValue)) {
        return;
      }

      value = nextValue;
      init = true;

      if (effects.size > 0) {
        for (const effect of effects) {
          effect.run();
        }
      }
    },
    remove(effect) {
      effects.delete(effect);
    },
    /**
     * batch() accepts a Set<Effect> and instead of running the effects immediately,
     * it will add them to the Set.
     *
     * It it up to the caller to run the effects in the Set.
     */
    batch(batch, ...args) {
      const nextValue =
        typeof write === "function"
          ? write(
              (observable, ...args) => {
                return observable.batch(batch, ...args);
              },
              ...(args as Args),
            )
          : (args[0] as Value);

      if (equality(value as Value, nextValue)) {
        return;
      }

      // If the observable has not been initialized, we can just set the value
      if (!init) {
        read = nextValue;
        return;
      }

      value = nextValue;
      for (const effect of effects) {
        batch.add(effect);
      }
    },
  };

  return obs;
}

/********************************    Mutable   ********************************/

/**
 * An "observable" that does not observe anything.
 *
 * This is used in production for things that cannot change.
 */
export type Mutable<Value, Args extends unknown[]> = Observable<Value, Args>;

export function mutable<Value>(
  read: undefined,
  write: undefined,
  equality?: Equality<Value>,
): Mutable<Value | undefined, never[]>;
export function mutable<Value>(): Mutable<Value | undefined, never[]>;
export function mutable<Value, Args extends unknown[]>(
  value: undefined,
  write?: MutableWrite<Value, Args>,
  equality?: Equality<Value>,
): Mutable<Value | undefined, Args>;
export function mutable<Value, Args extends unknown[]>(
  value?: Value,
  write?: MutableWrite<Value, Args>,
  equality: Equality<Value> = Object.is,
): Mutable<Value, Args> {
  return {
    get() {
      return value as Value;
    },
    set(...args) {
      const nextValue =
        typeof write === "function"
          ? write(undefined, ...(args as Args))
          : (args[0] as Value);

      if (!equality(value as Value, nextValue)) {
        value = nextValue;
      }
    },
    batch(_, ...args) {
      return this.set(...args);
    },
    remove() {},
  };
}

/********************************    Family    ********************************/

export type Family<Value, Args extends unknown[] = never[]> = ReturnType<
  typeof family<Value, Args>
>;

/**
 * Utility around Map that creates a new value if it doesn't exist.
 */
export function family<Value, Args extends unknown[]>(
  fn: (name: string, ...args: Args) => Value,
) {
  const map = new Map<string, Value>();
  return Object.assign(
    (name: string, ...args: Args) => {
      let result = map.get(name);
      if (!result) {
        result = fn(name, ...args);
        map.set(name, result);
      }
      return result!;
    },
    {
      clear() {
        map.clear();
      },
    },
  );
}

/**
 * Utility around WeakMap that creates a new value if it doesn't exist.
 */
export function weakFamily<Key extends WeakKey, Result>(
  fn: (key: Key) => Result,
) {
  const map = new WeakMap<Key, Result>();
  return Object.assign(
    (key: Key) => {
      let value = map.get(key);
      if (!value) {
        value = fn(key);
        map.set(key, value);
      }
      return value;
    },
    {
      has(key: Key) {
        return map.has(key);
      },
    },
  );
}

/******************************    Immutable    *******************************/

export class DraftableRecord<Value> {
  private draft: Record<string, Value>;

  constructor(
    private record: Record<string, Value> = {},
    private equality: Equality<Value> = Object.is,
  ) {
    this.draft = record;
  }

  set(key: string, value: Value) {
    if (this.equality(this.record[key], value)) {
      return;
    }

    if (this.draft === this.record) {
      this.draft = { ...this.record };
    }

    this.draft[key] = value;
  }

  assign(entries?: [string, Value][]) {
    if (!entries) return;

    for (const entry of entries) {
      this.set(entry[0], entry[1]);
    }
  }

  assignAll(entries?: [string, Value][][]) {
    if (!entries) return this;

    for (const entry of entries) {
      this.assign(entry);
    }

    return this;
  }

  commit() {
    if (this.draft !== this.record) {
      this.record = this.draft;
    }
    return this.record;
  }
}

export class DraftableArray<Value> {
  private draft: Value[] | undefined;
  private draftIndex: number;

  constructor(
    private array?: Value[],
    private equality: Equality<Value> = Object.is,
  ) {
    this.draft = array;
    this.draftIndex = -1;
  }

  push(value: Value) {
    this.draftIndex += 1;

    if (this.array && this.equality(this.array[this.draftIndex], value)) {
      return;
    }

    if (this.draft === this.array && Array.isArray(this.array)) {
      this.draft = this.array.slice(0, this.draftIndex);
    } else if (!this.draft) {
      this.draft = [];
    }

    this.draft.push(value);
  }

  pushAll(values: Value[]) {
    for (const value of values) {
      this.push(value);
    }
  }

  commit() {
    if (this.draft !== this.array) {
      this.array = this.draft;
    }
    this.draftIndex = -1;
    return this.array;
  }
}
