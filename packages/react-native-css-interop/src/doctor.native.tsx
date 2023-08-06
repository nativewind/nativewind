import { globalStyles } from "./runtime/native/globals";
import { StyleSheet } from "./runtime/native/stylesheet";
import { INTERNAL_VERIFICATION_FLAGS } from "./shared";

export function verifyJSX() {
  // @ts-expect-error
  return <react-native-css-interop-jsx-pragma-check /> === true;
}

export function verifyFlag(name: string, value: unknown = true) {
  return StyleSheet[INTERNAL_VERIFICATION_FLAGS][name] === value;
}

export function verifyReceivedData() {
  return StyleSheet[INTERNAL_VERIFICATION_FLAGS]["$$receivedData"] === true;
}

export function verifyHasStyles() {
  return globalStyles.size > 0;
}
