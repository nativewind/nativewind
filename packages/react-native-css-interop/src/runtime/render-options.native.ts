import { getGlobalStyle, getOpaqueStyle, styleMetaMap } from "./native/globals";
import {
  CSSInteropClassNamePropConfig,
  InteropFunctionOptions,
  StyleProp,
} from "../types";

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
  let hasMeta = false;

  // Every prop has 2 dependencies, the className and the existing styles (including undefined values)
  const dependencies: unknown[] = [];

  const configMap: Map<
    keyof P & string,
    CSSInteropClassNamePropConfig<P>
  > = new Map();

  for (const [classNameKey, config] of options) {
    if (config === undefined) continue;

    const classNames = remappedProps[classNameKey];
    delete remappedProps[classNameKey];

    if (typeof classNames !== "string" || !classNames) {
      // dependencies should always be the same size, even if the properties don't exist for this render
      dependencies.push(undefined, undefined);
      continue;
    }

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

    const existingStyles = remappedProps[targetKey];
    let styles: StyleProp = classNames
      .split(/\s+/)
      .map(getStyleFn)
      .filter(Boolean);

    dependencies.push(classNames, existingStyles);

    if (Array.isArray(existingStyles)) {
      styles = [...styles, ...existingStyles.map((style) => getStyleFn(style))];
    } else if (existingStyles) {
      styles = [...styles, getStyleFn(existingStyles)];
    } else {
      styles = styles;
    }

    if (targetKey !== classNameKey) {
      delete remappedProps[classNameKey];
    }

    if (styles.length > 0 && styles[0] !== undefined) {
      configMap.set(targetKey, config);
      remappedProps[targetKey] = styles as P[keyof P & string];
      hasMeta ||= stylePropHasMeta(styles);
    }
  }

  return {
    remappedProps,
    configMap,
    dependencies,
    hasMeta,
  };
}

function stylePropHasMeta(style: StyleProp): boolean {
  if (!style) return false;
  if (Array.isArray(style)) return style.some((s) => stylePropHasMeta(s));
  return styleMetaMap.has(style);
}
