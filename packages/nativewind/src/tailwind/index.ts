const isNative = Boolean(process.env.NATIVEWIND_NATIVE);

export default function preset({ ...options }: Record<string, unknown> = {}) {
  return isNative
    ? require("./native").default(options)
    : require("./web").default(options);
}

export { preset };
