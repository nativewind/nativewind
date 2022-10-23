/* eslint-disable unicorn/prefer-module,@typescript-eslint/no-var-requires */
const preset =
  process.env.NATIVEWIND_PLATFORM === "native"
    ? require("./native").default
    : require("./web").default;

function presetFactory({
  platform = process.env.NATIVEWIND_PLATFORM,
}: Record<string, unknown> = {}) {
  if (platform === "native") return require("./native").default;
  return require("./web").default;
}

export default Object.assign(presetFactory, preset);
