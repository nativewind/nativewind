import { flags } from "./runtime/native/globals";

export function verifyJSX() {
  // @ts-expect-error -- Ignored as this is invalid JSX
  return <react-native-css-interop-jsx-pragma-check /> === true;
}

export function verifyData() {
  if (process.env.NODE_ENV !== "test") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    if (require("./interop-poison.pill") === false) {
      throw new Error(
        `Your 'metro.config.js' has overridden the 'config.resolver.resolveRequest' config setting in a non-composable manner. Your styles will not work until this issue is resolved. Note that 'require('metro-config').mergeConfig' is a shallow merge and does not compose existing resolveRequest functions together.`,
      );
    }
  }

  return flags.has("enabled");
}

export function verifyFlag(name: string, value: unknown = "true") {
  return flags.get(name) === value;
}
