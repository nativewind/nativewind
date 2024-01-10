import { createElement, forwardRef } from "react";
import { CssInterop, StyleProp, JSXFunction } from "../types";
import { getNormalizeConfig } from "./config";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const config = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function CssInteropComponent(
    { ...props }: Record<string, any>,
    ref: any,
  ) {
    props = { ...props, ref };
    for (const entry of config) {
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

    return createElement(baseComponent, props);
  });
  interopComponent.displayName = `CssInterop.${
    baseComponent.displayName ?? baseComponent.name ?? "unknown"
  }`;
  interopComponents.set(baseComponent, interopComponent);
  return interopComponent;
};

// On web, these are the same
export const remapProps = cssInterop;
