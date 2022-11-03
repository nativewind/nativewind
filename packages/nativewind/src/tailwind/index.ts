/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */
const preset = process.env.NATIVEWIND_NATIVE
  ? require("./native").default
  : require("./web").default;

function presetFactory({
  isNative = process.env.NATIVEWIND_NATIVE,
}: Record<string, unknown> = {}) {
  if (isNative === "native") return require("./native").default;
  return require("./web").default;
}

export default Object.assign(presetFactory, preset);
