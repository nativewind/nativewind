import { StyleSheet } from "./stylesheet";

export function defaultCSSInterop(
  jsx: Function,
  type: any,
  { ...props }: Record<string | number, unknown>,
  reactKey: string | undefined,
  mapping: Map<string, unknown>,
) {
  for (const [classNameKey, value] of mapping) {
    if (!value) continue;

    // Extract the prop from the rest of the props
    const targetKey = typeof value === "string" ? value : classNameKey;
    const { [classNameKey]: classNames, ...rest } = props;

    if (typeof classNames === "string" && classNames) {
      // Replace props with rest, so it doesn't include [prop]
      props = rest;

      const style = {
        $$css: true,
        [classNameKey]: StyleSheet.classNameMergeStrategy(classNames),
      };

      if (typeof value === "string") {
        const existingProp = props[value];
        props[value] = Array.isArray(existingProp)
          ? [style, ...existingProp]
          : existingProp
          ? [style, existingProp]
          : style;
      }
    }
  }

  return jsx(type, props, reactKey);
}
