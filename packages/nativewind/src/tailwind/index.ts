module.exports = () =>
  process.env.NATIVEWIND_NATIVE === "web"
    ? require("./web").default
    : require("./native").default;
