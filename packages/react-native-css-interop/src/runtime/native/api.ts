import { createElement, forwardRef, useContext, useState } from "react";

import {
  assignToTarget,
  inlineSpecificity,
  PLACEHOLDER_SYMBOL,
  StyleRuleSetSymbol,
  StyleRuleSymbol,
} from "../../shared";
import type {
  CssInterop,
  JSXFunction,
  RuntimeValueDescriptor,
} from "../../types";
import { getNormalizeConfig } from "../config";
import { cleanupEffect, Effect } from "../observable";
import { colorScheme } from "./appearance-observables";
import { interop } from "./native-interop";
import { getVariable, opaqueStyles, VariableContext } from "./styles";
import { getComponentType } from "./unwrap-components";

export { StyleSheet } from "./stylesheet";
export { colorScheme } from "./appearance-observables";
export { rem } from "./unit-observables";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

/**
 * Generates a new Higher-Order component the wraps the base component and applies the styles.
 * This is added to the `interopComponents` map so that it can be used in the `wrapJSX` function
 * @param baseComponent
 * @param mapping
 */
export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  let component: any;
  const type = getComponentType(baseComponent);

  /**
   * This is a work-in-progress. We should be generating a new component that matches the
   * type of the previous component. E.g ForwardRef should be a ForwardRef, Memo should be Memo
   */
  if (type === "function") {
    component = (props: Record<string, any>) => {
      return interop(baseComponent, configs, props, undefined);
    };
  } else {
    component = forwardRef((props, ref) => {
      // This function will change className->style, add the extra props and do the "magic"
      return interop(baseComponent, configs, props, ref);
      // `interop` will return createElement(baseComponent, propsWithStylesAppliedAndEventHandlersAdded);
    });
  }

  const name = baseComponent.displayName ?? baseComponent.name ?? "unknown";
  component.displayName = `CssInterop.${name}`;
  interopComponents.set(baseComponent, component);
  return component;
};

export const remapProps: CssInterop = (component: any, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function RemapPropsComponent(
    { ...props }: Record<string, any>,
    ref: any,
  ) {
    for (const config of configs) {
      const source = props?.[config.source];

      // If the source is not a string or is empty, skip this config
      if (typeof source !== "string" || !source) continue;

      const placeholder = {
        [PLACEHOLDER_SYMBOL]: true,
      };
      opaqueStyles.set(placeholder, {
        [StyleRuleSetSymbol]: "RemappedClassName",
        classNames: source.split(/\s+/),
      });

      delete props[config.source];

      assignToTarget(props, placeholder, config, {
        objectMergeStyle: "toArray",
      });
    }

    props.ref = ref;
    return createElement(component as any, props, props.children);
  });

  interopComponents.set(component as any, interopComponent);
  return interopComponent;
};

export function useColorScheme() {
  const [effect, setEffect] = useState<Effect>(() => ({
    run: () => setEffect((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  cleanupEffect(effect);

  return {
    colorScheme: colorScheme.get(effect),
    setColorScheme: colorScheme.set,
    toggleColorScheme: colorScheme.toggle,
  };
}

export function vars(variables: Record<string, RuntimeValueDescriptor>) {
  const style: Record<string, any> = {};

  opaqueStyles.set(style, {
    [StyleRuleSetSymbol]: true,
    variables: true,
    n: [
      {
        [StyleRuleSymbol]: true,
        s: inlineSpecificity,
        variables: Object.entries(variables).map(([name, value]) => {
          return [name.startsWith("--") ? name : `--${name}`, value];
        }),
      },
    ],
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const context = useContext(VariableContext);

  const [effect, setState] = useState<Effect>(() => ({
    run: () => setState((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  let value: any = getVariable(name, context, effect);
  if (typeof value === "object" && "get" in value) {
    cleanupEffect(effect);
    value = value.get(effect);
  }

  return value;
};

/**
 * @deprecated Please use <SafeAreaProvider /> directly
 */
export const useSafeAreaEnv = () => {
  console.warn(
    "useSafeAreaEnv() is deprecated. Please use <SafeAreaProvider /> directly",
  );
};
