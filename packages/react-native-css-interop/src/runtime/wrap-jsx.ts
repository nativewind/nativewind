import { JSXFunction } from "../types";
import { interopComponents } from "./api";

if (process.env.NODE_ENV !== "test") require("./components");

export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    if (props && props.cssInterop === false) {
      delete props.cssInterop;
    } else {
      type = interopComponents.get(type) ?? type;
    }
    return jsx.call(jsx, type, props, ...rest);
  };
}
