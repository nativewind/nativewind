import { styleMetaMap } from "./native/globals";
import {
  CSSInteropClassNamePropConfig,
  InteropFunctionOptions,
  StyleProp,
} from "../types";
import { getGlobalStyle, getOpaqueStyle } from "./native/stylesheet";

export function getInteropFunctionOptions<P>(
  props: P,
  options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
): InteropFunctionOptions<P> {
  return getRenderOptions(props, options, getGlobalStyle);
}

export function getRemappedProps<P>(
  props: P,
  options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
) {
  return getRenderOptions(props, options, getOpaqueStyle).remappedProps;
}

function getRenderOptions<P>(
  { ...remappedProps }: P,
  options: Map<keyof P & string, CSSInteropClassNamePropConfig<P>>,
  getStyleFn: (style?: string | object) => object | undefined,
): InteropFunctionOptions<P> {
  let useWrapper = false;

  const dependencies: unknown[] = [];

  const configMap: Map<
    keyof P & string,
    CSSInteropClassNamePropConfig<P>
  > = new Map();

  for (const [classNameKey, config] of options) {
    if (config === undefined) continue;

    const classNames = remappedProps[classNameKey];
    delete remappedProps[classNameKey];

    let targetKey: (keyof P & string) | undefined;
    if (typeof config === "boolean") {
      targetKey = classNameKey;
    } else if (typeof config === "string") {
      targetKey = config;
    } else if (typeof config.target === "boolean") {
      targetKey = classNameKey;
      useWrapper ||= Boolean(config.nativeStyleToProp);
    } else if (typeof config.target === "string") {
      targetKey = config.target;
      useWrapper ||= Boolean(config.nativeStyleToProp);
    } else {
      throw new Error(
        `Unknown cssInterop target from config: ${JSON.stringify(config)}`,
      );
    }

    const existingStyles = remappedProps[targetKey];
    let styles: StyleProp =
      typeof classNames === "string"
        ? classNames.split(/\s+/).map(getStyleFn).filter(Boolean)
        : [];

    dependencies.push(classNames, existingStyles);

    if (Array.isArray(existingStyles)) {
      styles = [
        ...styles,
        ...existingStyles.map((style) => getGlobalStyle(style)),
      ];
    } else if (existingStyles) {
      styles = [...styles, getGlobalStyle(existingStyles)];
    }

    if (styles.length === 1 && styles[0]) {
      styles = styles[0];
    } else if (styles.length === 0) {
      styles = undefined;
    }

    if (styles) {
      configMap.set(targetKey, config);
      remappedProps[targetKey] = styles as P[keyof P & string];
      useWrapper ||= stylePropHasMeta(styles);
    }
  }

  return {
    remappedProps,
    configMap,
    dependencies,
    useWrapper,
  };
}

function stylePropHasMeta(style: StyleProp): boolean {
  if (!style) return false;
  if (Array.isArray(style)) return style.some((s) => stylePropHasMeta(s));
  return styleMetaMap.has(style);
}
