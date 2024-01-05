import { ComponentType, createElement as __createElement } from "react";
import type { CssInterop, JSXFunction, StyleProp } from "../types";
import { interopComponents } from "./components/rendering";
import { getNormalizeConfig } from "./config";

let hasAutoTagged = false;

export default function wrapJSX(jsx: JSXFunction): JSXFunction {
  return function (type, props, ...rest) {
    if (!hasAutoTagged) {
      require("./components");
      hasAutoTagged = true;
    }

    const config = interopComponents.get(type);

    if (config) {
      props = { ...props };
      for (const entry of config.config) {
        const key = entry[0];
        const sourceProp = entry[1];
        const newStyles: StyleProp = [];

        const value = props[sourceProp];
        if (typeof value === "string") {
          newStyles.push({
            $$css: true,
            [value]: value,
          } as StyleProp);
        }

        delete props[sourceProp];

        let styles: StyleProp = props[key];
        if (Array.isArray(styles)) {
          styles = [...newStyles, ...styles];
        } else if (styles) {
          styles = [...newStyles, styles];
        } else {
          styles = newStyles;
        }

        props[key] = styles;
      }
    }

    return jsx.call(jsx, type, props, ...rest);
  };
}

export const createElement = wrapJSX(__createElement as any);
export const cssInterop: CssInterop = (component, mapping) => {
  interopComponents.set(component, getNormalizeConfig(mapping));
  return component as ComponentType<any>;
};
// On web, these are the same
export const remapProps = cssInterop;
