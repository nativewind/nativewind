import { createElement as __createElement } from "react";
import type { JSXFunction } from "../types";
import { interopComponents } from "./api.native";

let hasAutoTagged = false;

export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    if (!hasAutoTagged && process.env.NODE_ENV !== "test") {
      require("./components");
      hasAutoTagged = true;
    }

    return jsx.call(jsx, interopComponents.get(type) ?? type, props, ...rest);
  };
}

export const createElement = wrapJSX(__createElement as any);
