import {
  CSSInteropClassNamePropConfig,
  InteropFunctionOptions,
  Style,
  StyleProp,
} from "../types";

const interopOptions = {
  configMap: new Map(),
  dependencies: [],
  hasMeta: false,
};

export function getInteropFunctionOptions<P>(
  props: P,
  options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
): InteropFunctionOptions<P> {
  return {
    remappedProps: getRemappedProps(props, options),
    ...interopOptions,
  };
}

export function getRemappedProps<P>(
  { ...props }: P,
  options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
) {
  for (const [classNameKey, config] of options) {
    if (!config) continue;

    const classNames = props[classNameKey];
    delete props[classNameKey];

    if (typeof classNames !== "string") continue;

    let targetKey: (keyof P & string) | undefined;
    if (typeof config === "boolean") {
      targetKey = classNameKey;
    } else if (typeof config === "string") {
      targetKey = config;
    } else if (typeof config.target === "boolean") {
      targetKey = classNameKey;
    } else if (typeof config.target === "string") {
      targetKey = config.target;
    } else {
      throw new Error(
        `Unknown cssInterop target from config: ${JSON.stringify(config)}`,
      );
    }

    const existingStyles = props[targetKey];
    let styles: StyleProp = [
      { $$css: true, [classNames]: classNames } as Style,
    ];

    if (Array.isArray(existingStyles)) {
      styles = [...styles, ...existingStyles];
    } else if (existingStyles) {
      styles = [...styles, existingStyles];
    }

    if (styles.length === 1 && styles[0]) {
      styles = styles[0];
    } else if (styles.length === 0) {
      styles = undefined;
    }

    props[targetKey] = styles as P[keyof P & string];
  }
  return props;
}
