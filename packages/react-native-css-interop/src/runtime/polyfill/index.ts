import type { ComponentType } from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";

import { defaultCSSInterop } from "../css-interop";
import { InteropFunction, polyfillMapping } from "./mapping";

export function enableCSSInterop<P>(
  component: ComponentType<P>,
  interop: InteropFunction = defaultCSSInterop,
) {
  polyfillMapping.set(component, interop);
}

enableCSSInterop(Animated.Text);
enableCSSInterop(Animated.View);
enableCSSInterop(Pressable);
enableCSSInterop(Text);
enableCSSInterop(View);
