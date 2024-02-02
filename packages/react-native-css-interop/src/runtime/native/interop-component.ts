import {
  ComponentType,
  createElement,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { ComponentState } from "../api.native";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { inheritanceContext } from "./inherited-context";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { observableNotifyQueue, observable } from "../observable";
import { globalVariables } from "./globals";
import { usePropState } from "./use-prop-state";
import { InteropComponentConfig } from "../../types";
import { globalStyles } from "./style-store";
import { opaqueStyles } from "./stylesheet";

const animatedCache = new Map<
  ComponentType<any> | string,
  ComponentType<any>
>();

const UpgradeState = {
  NONE: 0,
  UPGRADED: 1,
  WARNED: 2,
};

export function createInteropComponent(
  baseComponent: ComponentType<any>,
  configs: InteropComponentConfig[],
) {
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

    /**
     * Add event handlers
     */
    if (state.active) {
      props.onPressIn = (event: unknown) => {
        originalProps.onPressIn?.(event);
        state.active!.set(true);
      };
      props.onPressOut = (event: unknown) => {
        originalProps.onPressOut?.(event);
        state.active!.set(false);
      };
    }
    if (state.hover) {
      props.onHoverIn = (event: unknown) => {
        originalProps.onHoverIn?.(event);
        state.hover!.set(true);
      };
      props.onHoverOut = (event: unknown) => {
        originalProps.onHoverOut?.(event);
        state.hover!.set(false);
      };
    }
    if (state.focus) {
      props.onFocus = (event: unknown) => {
        originalProps.onFocus?.(event);
        state.focus!.set(true);
      };
      props.onBlur = (event: unknown) => {
        originalProps.onBlur?.(event);
        state.focus!.set(false);
      };
    }
    if (state.layout) {
      props.onLayout = (event: LayoutChangeEvent) => {
        originalProps.onLayout?.(event);
        const layout = event.nativeEvent.layout;
        const [width, height] = state.layout!.get() ?? [0, 0];
        if (layout.width !== width || layout.height !== height) {
          state.layout!.set([layout.width, layout.height]);
        }
      };
    }

    /**
     * Some React Native components (e.g Text) will not apply state event handlers
     * if `onPress` is not defined.
     */
    if (state.active || state.hover || state.focus) {
      props.onPress = (event: unknown) => {
        originalProps.onPress?.(event);
      };
    }

    /**
     * Component upgrades
     */
    let component = baseComponent;
    const shouldWarn = state.upgradeWarning.canWarn;

    /**
     * View->Pressable upgrade
     *
     * TODO: We can probably remove this in favor of using `new Pressability()`
     */
    if (component === View && (state.hover || state.active || state.focus)) {
      component = Pressable;
      if (shouldWarn && state.upgradeWarning.pressable === UpgradeState.NONE) {
        printUpgradeWarning(
          `Converting View to Pressable should only happen during the initial render otherwise it will remount the View.\n\nTo prevent this warning avoid adding styles which use pseudo-classes (e.g :hover, :active, :focus) to View components after the initial render, or change the View to a Pressable`,
          originalProps,
        );
      }
      state.upgradeWarning.pressable = UpgradeState.UPGRADED;
    }

    /**
     * <component> -> Animated.<component> upgrade
     */
    if (state.isAnimated) {
      if (shouldWarn && state.upgradeWarning.animated === UpgradeState.NONE) {
        printUpgradeWarning(
          `Converting component to animated component should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding animation/transition styles to components after the initial render, or add a default style that sets "animation: none", "transition-property: none"`,
          originalProps,
        );
      }
      state.upgradeWarning.animated = UpgradeState.UPGRADED;
      component = createAnimatedComponent(component);
    }

    /**
     * <component> -> <InheritanceContext.Provider><component></InheritanceContext.Provider>
     *
     * This is a hack to allow components to inherit variables/containers from their parents.
     */
    if (state.context || resetContext) {
      if (shouldWarn && state.upgradeWarning.context === UpgradeState.NONE) {
        printUpgradeWarning(
          `Making a component inheritable should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding CSS variables or 'container' styles to components after the initial render, or ensure it has a default style that sets either a CSS variable, "container: none" or "container-type: none"`,
          originalProps,
        );
      }
      state.upgradeWarning.context = UpgradeState.UPGRADED;

      if (resetContext) {
        state.context = { ...state };
      }

      props = {
        value: state.context,
        children: createElement(component, props),
      };
      component = inheritanceContext.Provider;
    }

    // After the initial render, the user shouldn't upgrade the component. Avoid warning in production
    state.upgradeWarning.canWarn = process.env.NODE_ENV !== "production";

    /**
     * Render the component!
     */
    return createElement(component, props);
  });

  interopComponent.displayName = `CssInterop.${
    baseComponent.displayName ?? baseComponent.name ?? "unknown"
  }`;

  return interopComponent;
}

export function createRemapComponent(
  baseComponent: ComponentType<any>,
  configs: InteropComponentConfig[],
) {
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
    return createElement(baseComponent as any, props, props.children);
  });

  interopComponent.displayName = `CssInterop.${
    baseComponent.displayName ?? baseComponent.name ?? "unknown"
  }`;

  return interopComponent;
}

function createAnimatedComponent(Component: ComponentType<any>): any {
  if (animatedCache.has(Component)) {
    return animatedCache.get(Component)!;
  } else if (Component.displayName?.startsWith("AnimatedComponent")) {
    return Component;
  }

  if (
    !(
      typeof Component !== "function" ||
      (Component.prototype && Component.prototype.isReactComponent)
    )
  ) {
    throw new Error(
      `Looks like you're passing an animation style to a function component \`${Component.name}\`. Please wrap your function component with \`React.forwardRef()\` or use a class component instead.`,
    );
  }

  let AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );

  /**
   * TODO: This wrapper shouldn't be needed, as we should just run the hook in the
   * original component. However, we get an error about running on the JS thread?
   */
  const CSSInteropAnimationWrapper = forwardRef((props: any, ref: any) => {
    const fallbackStyle = useRef<Record<string, any>>({}).current;

    /**
     * Reanimated has a bug where it doesn't fallback to the default value if the value is
     * removed from the style object. This code is a workaround to manually set the default
     * value.
     */
    // useMemo(() => {
    //   for (const [key, value] of Object.entries(props.style) as [
    //     string,
    //     any,
    //   ][]) {
    //     if (key === "transform") {
    //       fallbackStyle.transform = value.flatMap((v: any) => {
    //         const [key, value] = Object.entries(v)[0] as any;
    //         return { [key]: value };
    //       });
    //     } else if (
    //       typeof value === "object" &&
    //       "_isReanimatedSharedValue" in value
    //     ) {
    //       fallbackStyle[key] = defaultValues[key];
    //     } else {
    //       for (const subKey of Object.keys(value)) {
    //         fallbackStyle[key][subKey] = defaultValues[subKey];
    //       }
    //     }
    //   }
    // }, [props.style]);

    /**
     * This code shouldn't be needed, but inline shared values are not working properly.
     * https://github.com/software-mansion/react-native-reanimated/issues/5296
     */
    const style = useAnimatedStyle(() => {
      const style: any = { ...fallbackStyle };
      const entries = Object.entries(props.style ?? {});

      for (const [key, value] of entries as any) {
        if (typeof value === "object" && "_isReanimatedSharedValue" in value) {
          style[key] = value.value;
        } else if (key === "transform") {
          style.transform = value.map((v: any) => {
            const [key, value] = Object.entries(v)[0] as any;
            if (typeof value === "object" && "value" in value) {
              return { [key]: value.value };
            } else {
              return { [key]: value };
            }
          });
        } else {
          style[key] = value;
        }
      }

      return style;
    }, [props.style]);

    return createElement(AnimatedComponent, { ...props, style, ref });
  });
  CSSInteropAnimationWrapper.displayName = `CSSInteropAnimationWrapper(${
    Component.displayName ?? Component.name
  })`;

  animatedCache.set(Component, CSSInteropAnimationWrapper);

  return CSSInteropAnimationWrapper;
}

function printUpgradeWarning(
  warning: string,
  originalProps: Record<string, any>,
) {
  console.warn(
    `CssInterop upgrade warning.\n\n${warning}.\n\nIf add/removing sibling components cause this warning, add a unique "key" prop so React can correctly track this component.`,
  );
  try {
    // Not all props can be stringified
    console.warn(
      `The previous warning was caused by a component with these props: ${JSON.stringify(
        originalProps,
      )}`,
    );
  } catch {
    console.warn(
      `The previous warning was caused by a component with these props: ${JSON.stringify(
        Object.keys(originalProps),
      )}. Some props could not be stringified, so only the keys are shown.`,
    );
  }
}
