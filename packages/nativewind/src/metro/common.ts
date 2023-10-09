import type { GetTransformOptionsOpts } from "metro-config";

// This is separated so it can be used in tests
// Importing `withTailwind` will cause Jest to fail
export const cssToReactNativeRuntimeOptions = {
  /*
   * Ignore all warnings from `--tw` variables.
   * These are set by a number of Tailwind classes (and by @base) and
   * will flood the user with invalid warnings
   */
  ignorePropertyWarningRegex: ["^--tw-"],
  grouping: ["^group(/.*)?"],
};

export function getOutput(output: string, options: GetTransformOptionsOpts) {
  // Force a platform and `.css` extensions (as they might be using `.sass` or another preprocessor
  return `${output}.${options.platform !== "web" ? "native" : "web"}.css`;
}
