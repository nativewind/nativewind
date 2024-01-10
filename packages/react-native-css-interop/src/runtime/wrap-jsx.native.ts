import { JSXFunction } from "../types";
import { interopComponents } from "./api.native";

if (process.env.NODE_ENV !== "test") {
  require("./components");
}

export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    return jsx.call(jsx, interopComponents.get(type) ?? type, props, ...rest);
  };
}
