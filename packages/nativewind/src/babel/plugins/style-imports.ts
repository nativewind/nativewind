import type { ConfigAPI, PluginPass, Visitor } from "@babel/core";
import { addSideEffect } from "@babel/helper-module-imports";

/**
 * This plugin injects the import to the generated styles
 */
export function styleImports(api: ConfigAPI) {
  api.cache.invalidate(() => process.env.NATIVEWIND_OUTPUT);

  if (!process.env.NATIVEWIND_OUTPUT) {
    throw new Error(
      "Unable to find NativeWind output location. Did you forget to include the `metro.config.js` wrapper?"
    );
  }

  const visitor: Visitor<PluginPass> = {
    Program(path, state) {
      if (
        state.filename?.endsWith("nativewind/dist/index.js") &&
        process.env.NATIVEWIND_OUTPUT
      ) {
        addSideEffect(path, process.env.NATIVEWIND_OUTPUT);
      }
    },
  };

  return { visitor };
}
