/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */
export default function presetFactory({
  isNative = process.env.NATIVEWIND_NATIVE,
  ...options
}: Record<string, unknown> = {}) {
  return isNative
    ? require("./native").default(options)
    : require("./web").default(options);
}
