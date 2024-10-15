/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { createElement } from "react";

import type { jsxs } from "react/jsx-runtime";

import { interopComponents } from "./api";
import { maybeHijackSafeAreaProvider } from "./third-party-libs/react-native-safe-area-context";

/**
 * Create a new JSX function that swaps the component type being rendered with
 * the 'interop' version of the component if it exists.
 */
export default function wrapJSX(jsx: typeof jsxs): typeof jsxs;
export default function wrapJSX(
  jsx: typeof createElement,
): typeof createElement;
export default function wrapJSX(
  jsx: (type: any, props: any, ...rest: any[]) => any,
): typeof jsxs | typeof createElement {
  return function (type, props, ...rest) {
    if (typeof type === "string") {
      if (
        // This is invalid react code. Its used by the doctor to check if the JSX pragma is set correctly
        type === ("react-native-css-interop-jsx-pragma-check" as typeof type)
      ) {
        return true as any;
      }

      return jsx.call(jsx, type, props, ...rest);
    }

    // Load the core React Native components and create the interop versions
    // We avoid this in the test environment as we want more fine-grained control
    // This call also need to be inside the JSX transform to avoid circular dependencies
    if (process.env.NODE_ENV !== "test") require("./components");

    type = maybeHijackSafeAreaProvider(type);

    // You can disable the css interop by setting `cssInterop` to false
    if (
      typeof props === "object" &&
      props &&
      "cssInterop" in props &&
      props.cssInterop === false
    ) {
      delete props.cssInterop;
    } else {
      // Swap the component type with the interop version if it exists
      type = interopComponents.get(type) ?? type;
    }

    // Call the original jsx function with the new type
    return jsx.call(jsx, type, props, ...rest);
  };
}
