const computedStyles: Pick<CSSStyleDeclaration, "getPropertyValue"> =
  globalThis.window
    ? globalThis.window.getComputedStyle(
        globalThis.window.document.documentElement,
      )
    : { getPropertyValue: () => "asdf" };

export function verifyJSX() {
  // @ts-expect-error
  return <react-native-css-interop-jsx-pragma-check /> === true;
}

export function verifyFlag(name: string, value: unknown = "true") {
  // This is skipped in SSR rendering
  return globalThis.window
    ? computedStyles.getPropertyValue(
        name ? `--css-interop-${name}` : "--css-interop",
      ) === value
    : true;
}

export function verifyData() {
  // This is skipped in SSR rendering
  return globalThis.window
    ? computedStyles.getPropertyValue("--css-interop") !== ""
    : true;
}
