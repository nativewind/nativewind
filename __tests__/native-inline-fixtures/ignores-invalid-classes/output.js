Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = Test;
var _tailwindcssReactNative = require("tailwindcss-react-native");
var _reactNative = require("react-native");
var _src = require("../../../src");
var _jsxRuntime = require("react/jsx-runtime");
function Test() {
  return (0, _jsxRuntime.jsx)(_src.TailwindProvider, {
    children: (0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: (0, _tailwindcssReactNative.__useParseTailwind)(
        "grid grid-cols-3",
        { styles: __tailwindStyles, media: __tailwindMedia }
      ),
      children: "Hello world!",
    }),
  });
}
const __tailwindStyles = _reactNative.StyleSheet.create({});
const __tailwindMedia = {};
