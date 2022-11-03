/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */
export default function preset({
  isNative = process.env.NATIVEWIND_NATIVE,
}: Record<string, unknown> = {}) {
  return isNative ? require("./native").default : require("./web").default;
}
preset.nativewind = true;
