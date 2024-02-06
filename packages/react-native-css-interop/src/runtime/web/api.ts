import { Component, createElement, forwardRef, useState } from "react";
import { CssInterop, StyleProp, JSXFunction } from "../../types";
import { getNormalizeConfig } from "../config";
import { Effect } from "../observable";
import { colorScheme } from "./color-scheme";

export { StyleSheet } from "./stylesheet";
export { colorScheme } from "./color-scheme";
export { rem } from "./rem";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

const ForwardRefSymbol = Symbol.for("react.forward_ref");

export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function CssInteropComponent(
    { ...props }: Record<string, any>,
    ref: any,
  ) {
    props = { ...props, ref };
    for (const config of configs) {
      const newStyles: StyleProp = [];
      const value = props[config.source];
      if (typeof value === "string") {
        newStyles.push({
          $$css: true,
          [value]: value,
        } as StyleProp);
      }

      delete props[config.source];

      let styles: StyleProp = props[config.target];
      if (Array.isArray(styles)) {
        styles = [...newStyles, ...styles];
      } else if (styles) {
        styles = [...newStyles, styles];
      } else {
        styles = newStyles;
      }

      props[config.target] = styles;
    }

    if (
      "$$typeof" in baseComponent &&
      typeof baseComponent === "function" &&
      baseComponent.$$typeof === ForwardRefSymbol
    ) {
      return (baseComponent as any).render(props, props.ref);
    } else if (
      typeof baseComponent === "function" &&
      !(baseComponent.prototype instanceof Component)
    ) {
      return (baseComponent as any)(props);
    } else {
      return createElement(baseComponent, props);
    }
  });
  interopComponent.displayName = `CssInterop.${
    baseComponent.displayName ?? baseComponent.name ?? "unknown"
  }`;
  interopComponents.set(baseComponent, interopComponent);
  return interopComponent;
};

// On web, these are the same
export const remapProps = cssInterop;

export function useColorScheme() {
  const [effect, setEffect] = useState<Effect>(() => ({
    rerun: () => setEffect((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  return {
    colorScheme: colorScheme.get(effect),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  };
}

export const useUnstableNativeVariable = (name: string) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("useUnstableNativeVariable is not supported on web.");
  }
  return undefined;
};

export function vars<T extends Record<`--${string}`, string | number>>(
  variables: T,
) {
  const $variables: Record<string, string> = {};

  for (const [key, value] of Object.entries(variables)) {
    if (key.startsWith("--")) {
      $variables[key] = value.toString();
    } else {
      $variables[`--${key}`] = value.toString();
    }
  }
  return $variables;
}
