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
