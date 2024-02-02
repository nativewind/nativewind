import { createElement, forwardRef, useContext, useState } from "react";
import type {
  CssInterop,
  JSXFunction,
  RuntimeValueDescriptor,
} from "../../types";
import { getNormalizeConfig } from "../config";
import { colorScheme, variableContext } from "./globals";
import { Effect, cleanupEffect } from "../observable";
import { globalStyles } from "./stylesheet";
import { interop } from "./native-interop";
import { opaqueStyles } from "./style-store";

export { StyleSheet } from "./stylesheet";
export { colorScheme, rem } from "./globals";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function CssInteropComponent(
    originalProps: Record<string, any>,
    ref: any,
  ) {
    return interop(baseComponent, configs, originalProps, ref);
  });

  interopComponent.displayName = `CssInterop.${
    baseComponent.displayName ?? baseComponent.name ?? "unknown"
  }`;
  interopComponents.set(baseComponent, interopComponent);
  return interopComponent;
};

export const remapProps: CssInterop = (component: any, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function RemapPropsComponent(
    { ...props }: Record<string, any>,
    ref: any,
  ) {
    for (const config of configs) {
      let rawStyles = [];

      const source = props?.[config.source];

      if (typeof source !== "string") continue;
      delete props[config.source];

      for (const className of source.split(/\s+/)) {
        const signal = globalStyles.get(className);

        if (signal !== undefined) {
          const style = {};
          const styleRuleSet = signal.get();
          opaqueStyles.set(style, styleRuleSet);
          rawStyles.push(style);
        }
      }

      if (rawStyles.length !== 0) {
        const existingStyle = props[config.target];

        if (Array.isArray(existingStyle)) {
          rawStyles.push(...existingStyle);
        } else if (existingStyle) {
          rawStyles.push(existingStyle);
        }

        props[config.target] =
          rawStyles.length === 1 ? rawStyles[0] : rawStyles;
      }
    }

    props.ref = ref;
    return createElement(component as any, props, props.children);
  });

  interopComponents.set(component as any, interopComponent);
  return interopComponent;
};

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

export function vars(variables: Record<string, RuntimeValueDescriptor>) {
  const style: Record<string, any> = {};
  opaqueStyles.set(style, {
    $$type: "StyleRuleSet",
    variables: true,
    normal: [
      {
        $$type: "StyleRule",
        specificity: { inline: 1 },
        variables: Object.entries(variables).map(([name, value]) => {
          return [name.startsWith("--") ? name : `--${name}`, value];
        }),
      },
    ],
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const context = useContext(variableContext);

  const [effect, setState] = useState<Effect>(() => ({
    rerun: () => setState((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  let value = context[name];
  if (typeof value === "object" && "get" in value) {
    cleanupEffect(effect);
    value = value.get(effect);
  }

  return value;
};
