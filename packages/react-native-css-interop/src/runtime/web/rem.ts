import { INTERNAL_RESET } from "../../shared";
import { Effect, observable } from "../observable";

const isSSR = globalThis.window === undefined;

export const _rem = observable(
  isSSR
    ? 16
    : Number.parseFloat(
        globalThis.window.getComputedStyle(
          globalThis.window.document.documentElement,
        ).fontSize,
      ) || 16,
);

export const rem = {
  get(effect?: Effect) {
    return _rem.get(effect);
  },
  set(value: number) {
    _rem.set(value);
    if (!isSSR) {
      globalThis.window.document.documentElement.style.fontSize = `${value}px`;
    }
  },
  [INTERNAL_RESET](value = 16) {
    _rem.set(value);
  },
};
