const isNative = Boolean(process.env.NATIVEWIND_NATIVE);

const preset = isNative
  ? require("./native").default
  : require("./web").default;

module.exports = () => preset;
