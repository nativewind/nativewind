import {
  createElement,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CssInterop, JSXFunction, RuntimeValueDescriptor } from "../types";
import { getNormalizeConfig } from "./config";
import { usePropState } from "./native/use-prop-state";
import { colorScheme, globalVariables } from "./native/globals";
import {
  Effect,
  Observable,
  observable,
  observableNotifyQueue,
} from "./observable";
import { globalStyles, opaqueStyles } from "./native/stylesheet";
import { UpgradeState, renderComponent } from "./native/render-component";
import {
  InheritedParentContext,
  inheritanceContext,
} from "./native/inherited-context";
import { DEFAULT_CONTAINER_NAME } from "../shared";

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

export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const configs = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function CssInteropComponent(
    originalProps: Record<string, any>,
    ref: any,
  ) {
    const parent = useContext(inheritanceContext);

    useEffect(() => {
      const queue = [...observableNotifyQueue];
      observableNotifyQueue.clear();
      for (const sub of queue) {
        sub();
      }
    });

    const stateRef = useRef<ComponentState>();
    if (!stateRef.current) {
      const state: ComponentState = {
        parent,
        isAnimated: false,
        inlineVariables: new Map(),
        inlineContainerNames: new Set(),
        container: observable(undefined),
        getContainer(name, effect, isParent = false) {
          if (isParent && state.inlineContainerNames.has(name)) {
            return state.container;
          }
          return state.parent.getContainer(name, effect, true);
        },
        getVariable(name, effect) {
          let value: any = undefined;
          value ??= state.inlineVariables.get(name)?.get(effect);
          value ??= globalVariables.universal.get(name)?.get(effect);
          value ??= state.parent.getVariable(name, effect);
          return value;
        },
        getActive(effect) {
          state.active ??= observable(false, { name: "active" });
          return state.active.get(effect);
        },
        getHover(effect) {
          state.hover ??= observable(false);
          return state.hover.get(effect);
        },
        getFocus(effect) {
          state.focus ??= observable(false);
          return Boolean(state.focus.get(effect));
        },
        getLayout(effect) {
          state.layout ??= observable(undefined);
          return state.layout.get(effect);
        },
        upgradeWarning: {
          animated: UpgradeState.NONE,
          context: UpgradeState.NONE,
          pressable: UpgradeState.NONE,
          canWarn: false,
        },
      };
      state.container.set(state, false);
      stateRef.current = state;
    }
    const state = stateRef.current!;
    state.parent = parent;

    const previousVariables = Array.from(state.inlineVariables.keys());
    const previousContainers = Array.from(state.inlineContainerNames.keys());
    state.inlineContainerNames.clear();
    let props: Record<string, any> = { ...originalProps, ref };
    let resetContext = false;

    for (const config of configs) {
      const result = usePropState(state, originalProps, config);

      resetContext ||= result.resetContext;
      state.isAnimated ||= result.isAnimated;

      /**
       * Merge the variables
       */
      for (const [name, value] of result.variables) {
        let variable = state.inlineVariables.get(name);
        if (!variable) {
          state.inlineVariables.set(name, observable(value));
        } else {
          variable.set(value, false); // Do not immediately notify
        }
      }

      /**
       * Merge the container names
       */
      if (result.containerNames === null) {
        state.inlineContainerNames.clear();
      } else if (result.containerNames.length) {
        for (const name of result.containerNames) {
          state.inlineContainerNames.add(name);
        }
        state.inlineContainerNames.add(DEFAULT_CONTAINER_NAME);
      }

      Object.assign(props, result.props);
      if (config.target !== config.source) {
        delete props[config.source];
      }
    }

    /**
     * Cleanup old variables
     */
    for (const name of previousVariables) {
      if (!state.inlineVariables.has(name)) {
        state.inlineVariables.delete(name);
      }
    }

    /**
     * Cleanup old containers
     */
    if (previousContainers.length && state.inlineContainerNames.size === 0) {
      // If we previously had containers, but now we don't
      state.container.set(undefined, false);
    } else if (state.inlineContainerNames.size) {
      // If we previously had containers, but now we do
      state.container.set(state, false);
      state.layout ??= observable(undefined);
      state.active ??= observable(false);
      state.hover ??= observable(false);
      state.focus ??= observable(false);
    }

    return renderComponent(
      baseComponent,
      state,
      props,
      originalProps,
      resetContext,
    );
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
          opaqueStyles.set(style, signal.get());
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
