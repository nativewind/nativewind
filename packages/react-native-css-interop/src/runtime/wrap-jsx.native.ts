import { createElement as __createElement } from "react";
import { interopJSX } from "./components/api.native";
import type { JSXFunction } from "../types";

let hasAutoTagged = false;

export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    if (!hasAutoTagged && process.env.NODE_ENV !== "test") {
      require("./components");
      hasAutoTagged = true;
    }

    return interopJSX(jsx, type, props, ...rest);
  };
}

export const createElement = wrapJSX(__createElement as any);
