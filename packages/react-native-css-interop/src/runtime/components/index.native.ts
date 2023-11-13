import "./react-native";
import { cssInterop } from "../render";

/**
 *  These are popular 3rd party libraries that we want to support out of the box.
 */
try {
  const { Svg } = require("react-native-svg");
  cssInterop(Svg, { className: "style" });
} catch {}
try {
  const { SafeAreaView } = require("react-native-safe-area-context");
  cssInterop(SafeAreaView, { className: "style" });
} catch {}
