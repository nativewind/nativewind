/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */
export default function presetFactory({
  isNative = process.env.NATIVEWIND_NATIVE,
  ...options
}: Record<string, unknown> = {}) {
  const preset = isNative
    ? require("./native").default(options)
    : require("./web").default(options);

  preset.nativewind = true;

  return preset;
}
presetFactory.nativewind = true;
