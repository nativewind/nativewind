export default function presetFactory({
  isNative = process.env.NATIVEWIND_NATIVE ?? true,
  ...options
}: Record<string, unknown> = {}) {
  return isNative
    ? require("./native").default(options)
    : require("./web").default(options);
}
