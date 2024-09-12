import { flags } from "./runtime/native/globals";

export function verifyJSX() {
  // @ts-expect-error
  return <react-native-css-interop-jsx-pragma-check /> === true;
}

export function verifyData() {
  return flags.has("enabled");
}

export function verifyFlag(name: string, value: unknown = "true") {
  return flags.get(name) === value;
}
