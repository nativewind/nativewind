import type { ComponentType } from "react";
import { View, Text, Pressable } from "react-native";
import Animated from "react-native-reanimated";

import { defaultCSSInterop } from "../css-interop";
import { InteropFunction, polyfillMapping } from "./mapping";

export function enableCSSInterop<P>(
  component: ComponentType<P>,
  interop: InteropFunction | Record<keyof P, string> = defaultCSSInterop,
) {
  if (typeof interop === "function") {
    polyfillMapping.set(component, interop);
  } else {
    polyfillMapping.set(component, (...props) => {
      return defaultCSSInterop(...props, interop);
    });
  }
}

enableCSSInterop(Animated.Text);
enableCSSInterop(Animated.View);
enableCSSInterop(Pressable);
enableCSSInterop(Text);
enableCSSInterop(View);
