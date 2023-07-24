import { polyfillMapping } from "./polyfill/mapping";

export function render(
  jsx: Function,
  type: any,
  props: Record<string | number, unknown>,
  key: string,
) {
  const cssInterop = polyfillMapping.get(type);
  return cssInterop ? cssInterop(jsx, type, props, key) : jsx(type, props, key);
}
