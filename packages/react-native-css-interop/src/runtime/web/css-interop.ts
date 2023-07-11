import { CssInteropPropMapping } from "../../types";
import { StyleSheet } from "./stylesheet";

export function defaultCSSInterop(
  jsx: Function,
  type: any,
  { ...props }: Record<string | number, unknown>,
  reactKey: string,
  mapping: CssInteropPropMapping = { style: "className" },
) {
  for (const [key, prop] of Object.entries(mapping)) {
    // Extract the prop from the rest of the props
    const propToExtract = prop === true ? key : prop;
    const { [propToExtract]: classNames, ...rest } = props;

    if (typeof classNames === "string") {
      // Replace props with rest, so it doesn't include [prop]
      props = rest;

      const style = {
        $$css: true,
        // Merge based upon the key
        // If multiple props combine to the same key they will override each other
        [key]: StyleSheet.classNameMergeStrategy(classNames),
      };

      const existingProp = props[key];

      props[key] = Array.isArray(existingProp)
        ? [style, ...existingProp]
        : props.style
        ? [style, existingProp]
        : style;
    }
  }

  return jsx(type, props, reactKey);
}
