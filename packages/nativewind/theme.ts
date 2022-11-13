/* eslint-disable unicorn/prefer-module */
module.exports = process.env.NATIVEWIND_NATIVE
  ? require("./dist/runtime/native/theme-functions")
  : require("./dist/runtime/web/theme-functions");
