import type { JSXFunction } from "../types";
import { interopComponents } from "./api";

export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    if (process.env.NODE_ENV !== "test") require("./components");

    if (props && props.cssInterop === false) {
      delete props.cssInterop;
    } else {
      type = interopComponents.get(type) ?? type;
    }
    return jsx.call(jsx, type, props, ...rest);
  };
}
