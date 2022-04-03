Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = Test;
var _reactNative = require("react-native");
var _src = require("../../../src");
var _jsxRuntime = require("react/jsx-runtime");
function Test() {
  return (0, _jsxRuntime.jsx)(_src.TailwindProvider, {
    children: (0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: { $$css: true, tailwindcssReactNative: "font-bold" },
      children: "Hello world!",
    }),
  });
}
