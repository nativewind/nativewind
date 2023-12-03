import {
  ComponentClass,
  FunctionComponent,
  ReactNode,
  createElement,
} from "react";
import type {
  CssInterop,
  EnableCssInteropOptions,
  NativeStyleToProp,
  NormalizedOptions,
  StyleProp,
} from "../../types";

export const interopComponents = new Map<object | string, NormalizedOptions>();

export function render(jsx: any, type: any, props: any, ...args: any) {
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

  return jsx(type, props, ...args);
}

export const cssInterop: CssInterop = (component, mapping) => {
  interopComponents.set(component, getNormalizeConfig(mapping));
  return component;
};

// On web, these are the same
export const remapProps = cssInterop;

export function createElementAndCheckCssInterop(
  type: string | FunctionComponent | ComponentClass,
  props: Record<string, any>,
  ...children: ReactNode[]
) {
  return render(createElement, type, props, ...children);
}

function getNormalizeConfig(
  mapping: EnableCssInteropOptions<any>,
): NormalizedOptions {
  const config = new Map<
    string,
    [string, NativeStyleToProp<any> | undefined]
  >();
  const dependencies = new Set<string>();
  const sources = new Set<string>();

  for (const [key, options] of Object.entries(mapping) as Array<
    [string, EnableCssInteropOptions<any>[string]]
  >) {
    let target: string | undefined;
    let nativeStyleToProp: NativeStyleToProp<any> | undefined;

    if (!options) continue;

    if (typeof options === "boolean") {
      target = key;
    } else if (typeof options === "string") {
      target = options;
    } else if (typeof options.target === "boolean") {
      target = key;
      nativeStyleToProp = options.nativeStyleToProp;
    } else if (typeof options.target === "string") {
      target = options.target;
      nativeStyleToProp = options.nativeStyleToProp;
    } else {
      throw new Error(
        `Unknown cssInterop target from config: ${JSON.stringify(config)}`,
      );
    }

    config.set(target, [key, nativeStyleToProp]);
    dependencies.add(target);
    dependencies.add(key);
    sources.add(key);
  }

  return {
    dependencies: Array.from(dependencies),
    sources: Array.from(sources),
    config: Array.from(config.entries()).map(
      ([key, [source, nativeStyleToProp]]) => [key, source, nativeStyleToProp],
    ),
  };
}
