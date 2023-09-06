import { InteropFunction, StyleProp } from "../types";

export const defaultCSSInterop: InteropFunction = (
  component,
  options,
  props,
  children,
) => {
  for (const [key, { sources }] of options.config) {
    const newStyles: StyleProp = [];

    for (const source of sources) {
      const value = props[source];
      if (typeof value === "string") {
        newStyles.push({
          $$css: true,
          [value]: value,
        } as StyleProp);
      }

      delete props[source];
    }

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

  return [component, props, children];
};
