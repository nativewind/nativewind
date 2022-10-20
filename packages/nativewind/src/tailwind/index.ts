/* eslint-disable unicorn/prefer-module */
const preset =
  process.env.NATIVEWIND_PLATFORM === "native"
    ? require("./native")
    : require("./web");

function presetFactory({
  platform = process.env.NATIVEWIND_PLATFORM,
}: Record<string, unknown> = {}) {
  if (platform === "native") return require("./native");
  return require("./web");
}

export default Object.assign(presetFactory, preset);
