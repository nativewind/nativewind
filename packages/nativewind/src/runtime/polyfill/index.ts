import type { ComponentType } from "react";
import { View, Text, Pressable } from "react-native";

import { defaultCSSInterop } from "../web/css-interop";
import { InteropFunction, polyfillMapping } from "./mapping";
import { CssInteropPropMapping } from "../../types";

export { defaultCSSInterop };

export function makeStyled<P>(
  component: ComponentType<P>,
  interop: InteropFunction | Record<keyof P, string> = defaultCSSInterop,
) {
  if (typeof interop === "function") {
    polyfillMapping.set(component, interop);
  } else {
    polyfillMapping.set(component, (...props) => {
      return defaultCSSInterop(
        ...props,
        Object.entries(interop) as CssInteropPropMapping,
      );
    });
  }
}

makeStyled(View);
makeStyled(Pressable);
makeStyled(Text);

export const svgCSSInterop = defaultCSSInterop;
