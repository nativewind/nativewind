let computedStyles: any = {
  getPropertyValue() {
    return null;
  },
};

if (globalThis.window) {
  computedStyles = globalThis.window.getComputedStyle(
    globalThis.window.document.documentElement,
  );
}

export function verifyJSX() {
  // @ts-expect-error
  return <react-native-css-interop-jsx-pragma-check /> === true;
}

export function verifyFlag(name?: string, value: unknown = "true") {
  return globalThis.window
    ? computedStyles.getPropertyValue(
        name ? `--css-interop-${name}` : "--css-interop",
      ) === value
    : true;
}

export function verifyReceivedData() {
  return verifyFlag();
}
