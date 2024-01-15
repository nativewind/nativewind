import { useContext, useState } from "react";
import type { CssInterop, JSXFunction, RuntimeValueDescriptor } from "../types";
import { getNormalizeConfig } from "./config";
import { colorScheme } from "./native/globals";
import { Effect, Observable } from "./observable";
import { opaqueStyles } from "./native/stylesheet";
import {
  createInteropComponent,
  createRemapComponent,
} from "./native/interop-component";
import {
  InheritedParentContext,
  inheritanceContext,
} from "./native/inherited-context";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

export type ComponentState = InheritedParentContext & {
  parent: InheritedParentContext;
  context?: InheritedParentContext;
  inlineVariables: Map<string, Observable<RuntimeValueDescriptor>>;
  inlineContainerNames: Set<string>;
  isAnimated: boolean;
  upgradeWarning: {
    animated: number;
    context: number;
    pressable: number;
    canWarn: boolean;
  };
};

export const cssInterop: CssInterop = (component, mapping): any => {
  const config = getNormalizeConfig(mapping);
  const interopComponent = createInteropComponent(component, config);
  interopComponents.set(component, interopComponent);
  return interopComponent;
};

export const remapProps: CssInterop = (component: any, mapping): any => {
  const config = getNormalizeConfig(mapping);
  const interopComponent = createRemapComponent(component, config);
  interopComponents.set(component, interopComponent);
  return interopComponent;
};

export function useColorScheme() {
  const [effect, setEffect] = useState<Effect>(() => ({
    rerender: () => setEffect((s) => ({ ...s })),
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
    inline: [
      {
        $$type: "StyleRule",
        variables: Object.entries(variables).map(([name, value]) => {
          return [name.startsWith("--") ? name : `--${name}`, value];
        }),
        specificity: {
          A: 0,
          B: 0,
          C: 0,
          I: 0,
          O: 0,
          S: 0,
          inline: 1,
        },
      },
    ],
  });
  return style;
}

export const useUnstableNativeVariable = (name: string) => {
  const context = useContext(inheritanceContext);

  const [effect, setEffect] = useState<Effect>(() => ({
    rerender: () => setEffect((s) => ({ ...s })),
    dependencies: new Set(),
  }));

  return context.getVariable(name, effect);
};
