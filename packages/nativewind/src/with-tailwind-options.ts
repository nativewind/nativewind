// This is seperated so it can be used in tests
// Importing `withTailwind` will cause Jest to fail
export const cssToReactNativeRuntimeOptions = {
  ignorePropertyWarningRegex: ["^--tw-"],
};
