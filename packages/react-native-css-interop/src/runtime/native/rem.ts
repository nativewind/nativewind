import { INTERNAL_RESET } from "../../shared";
import { createSignal } from "../signals";

export const rem = (function createRem(defaultValue: number = 14) {
  const signal = createSignal<number>(defaultValue);

  const get = () => signal.get() ?? defaultValue;
  const set = (nextValue: number) => signal.set(nextValue || defaultValue);
  const reset = () => set(defaultValue);

  return { get, set, [INTERNAL_RESET]: reset };
})();
