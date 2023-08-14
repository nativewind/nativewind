import { INTERNAL_RESET } from "../../shared";
import { createSignal } from "../signals";

const isSSR = globalThis.window === undefined;

export const rem = (function createRem(defaultValue: number = 16) {
  const signal = createSignal<number>(
    isSSR
      ? defaultValue
      : Number.parseFloat(
          globalThis.window.getComputedStyle(
            globalThis.window.document.documentElement,
          ).fontSize,
        ),
  );

  const get = () => signal.get();
  const set = (nextValue: number) => {
    signal.set(nextValue || defaultValue);
    if (!isSSR) {
      globalThis.window.document.documentElement.style.fontSize = `${nextValue}px`;
    }
  };
  const reset = () => set(defaultValue);

  return { get, set, [INTERNAL_RESET]: reset };
})();
