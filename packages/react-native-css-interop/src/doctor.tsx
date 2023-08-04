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

export function verifyFlag(name: string, value: unknown = "true") {
  return computedStyles.getPropertyValue(`--${name}`) === value;
}

export function verifyReceivedData() {
  return (
    computedStyles.getPropertyValue(`--react-native-css-interop`) === "true"
  );
}

export function verifyHasStyles() {
  return (
    computedStyles.getPropertyValue(`--react-native-css-interop`) === "true"
  );
}
