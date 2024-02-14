module.exports = () =>
  // This will be undefined on most platforms
  process.env.NATIVEWIND_NATIVE === undefined ||
  process.env.NATIVEWIND_NATIVE === "web"
    ? require("./web").default
    : require("./native").default;
