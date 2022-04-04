Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = Test;
var _tailwindcssReactNative = require("tailwindcss-react-native");
var _reactNative = require("react-native");
var _src = require("../../../src");
var _jsxRuntime = require("react/jsx-runtime");
function Test(_ref) {
  var isBold = _ref.isBold,
    isUnderline = _ref.isUnderline;
  var classNames = [];
  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");
  return (0, _jsxRuntime.jsx)(_src.TailwindProvider, {
    children: (0, _jsxRuntime.jsx)(_reactNative.Text, {
      style: (0, _tailwindcssReactNative.__useParseTailwind)(
        classNames.join(" "),
        { styles: __tailwindStyles, media: __tailwindMedia }
      ),
      children: "Hello world!",
    }),
  });
}
const __tailwindStyles = _reactNative.StyleSheet.create({
  "font-bold": { fontWeight: "700" },
  underline: { textDecorationLine: "underline" },
});
const __tailwindMedia = {};
