/**
 * These need to be in a separate file as they are also used by Babel
 *
 * The main file imports 'react-native' which needs to be compiled
 */
export function isRuntimeFunction(input: unknown): input is string {
  return typeof input === "string" && input.startsWith("__{");
}
