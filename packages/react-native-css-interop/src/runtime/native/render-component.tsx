import { ComponentType, createElement, forwardRef } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";

import { containerContext } from "./globals";
import { observable } from "../observable";
import { SharedState } from "./types";
import { VariableContext } from "./$$styles";

const animatedCache = new Map<
  ComponentType<any> | string,
  ComponentType<any>
>();

export const UpgradeState = {
  NONE: 0,
  SHOULD_UPGRADE: 1,
  UPGRADED: 2,
  WARNED: 3,
};

/**
 * Render the baseComponent
 * @param baseComponent
 * @param state
 * @param props
 * @param variables
 * @param containers
 * @returns
 */
export function renderComponent(
  baseComponent: ComponentType<any>,
  state: SharedState,
  props: Record<string, any>,
  variables?: Record<string, any>,
  containers?: Record<string, any>,
) {
  let component = baseComponent;
  const shouldWarn = state.canUpgradeWarn;
  const isContainer = state.containers;

  if (state.active || isContainer) {
    state.active ??= observable(false);
    props.onPressIn = (event: unknown) => {
      state.originalProps?.onPressIn?.(event);
      state.active!.set(true);
    };
    props.onPressOut = (event: unknown) => {
      state.originalProps?.onPressOut?.(event);
      state.active!.set(false);
    };
  }
  if (state.hover || isContainer) {
    state.hover ??= observable(false);
    props.onHoverIn = (event: unknown) => {
      state.originalProps?.onHoverIn?.(event);
      state.hover!.set(true);
    };
    props.onHoverOut = (event: unknown) => {
      state.originalProps?.onHoverOut?.(event);
      state.hover!.set(false);
    };
  }

  if (state.focus || isContainer) {
    state.focus ??= observable(false);
    props.onFocus = (event: unknown) => {
      state.originalProps?.onFocus?.(event);
      state.focus!.set(true);
    };
    props.onBlur = (event: unknown) => {
      state.originalProps?.onBlur?.(event);
      state.focus!.set(false);
    };
  }
  /**
   * Some React Native components (e.g Text) will not apply state event handlers
   * if `onPress` is not defined.
   */
  if (state.active || state.hover || state.focus) {
    props.onPress = (event: unknown) => {
      state.originalProps?.onPress?.(event);
    };
  }

  if (state.layout || isContainer) {
    state.layout ??= observable([0, 0]);
    props.onLayout = (event: LayoutChangeEvent) => {
      state.originalProps?.onLayout?.(event);
      const layout = event.nativeEvent.layout;
      const prevLayout = state.layout!.get();
      if (layout.width !== prevLayout[0] || layout.height !== prevLayout[0]) {
        state.layout!.set([layout.width, layout.height]);
      }
    };
  }

  // TODO: We can probably remove this in favor of using `new Pressability()`
  if (component === View && (state.hover || state.active || state.focus)) {
    component = Pressable;
    props.cssInterop = false;
    if (shouldWarn && state.pressable === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Converting View to Pressable should only happen during the initial render otherwise it will remount the View.\n\nTo prevent this warning avoid adding styles which use pseudo-classes (e.g :hover, :active, :focus) to View components after the initial render, or change the View to a Pressable`,
        state.originalProps,
      );
    }
    state.pressable = UpgradeState.UPGRADED;
  }

  if (state.animated) {
    if (shouldWarn && state.animated === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Converting component to animated component should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding animation/transition styles to components after the initial render, or add a default style that sets "animation: none", "transition-property: none"`,
        state.originalProps,
      );
    }
    state.animated = UpgradeState.UPGRADED;
    component = createAnimatedComponent(component);
  }

  if (state.variables) {
    if (shouldWarn && state.variables === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Making a component inheritable should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding CSS variables or 'container' styles to components after the initial render, or ensure it has a default style that sets either a CSS variable, "container: none" or "container-type: none"`,
        state.originalProps,
      );
    }
    state.variables = UpgradeState.UPGRADED;

    props = {
      value: variables,
      children: createElement(component, props),
    };
    component = VariableContext.Provider;
  }

  if (state.containers) {
    if (shouldWarn && state.containers === UpgradeState.SHOULD_UPGRADE) {
      printUpgradeWarning(
        `Making a component inheritable should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding CSS variables or 'container' styles to components after the initial render, or ensure it has a default style that sets either a CSS variable, "container: none" or "container-type: none"`,
        state.originalProps,
      );
    }
    state.containers = UpgradeState.UPGRADED;

    props = {
      value: containers,
      children: createElement(component, props),
    };
    component = containerContext.Provider;
  }

  // After the initial render, the user shouldn't upgrade the component. Avoid warning in production
  state.canUpgradeWarn = process.env.NODE_ENV !== "production";

  /**
   * A hack to improve performance by avoiding adding duplicate components to the render tree
   *
   * The native interop already substitutes the component with a ForwardRef, so if we render a <View /> it actually renders
   *
   * <ForwardRef>
   *   <ForwardRef>
   *     <View>
   *
   * Instead of rendering the extra ForwardRef, we can compose them together (by directly calling the render function) into the same component, so it renders
   * <ForwardRef>
   *   <View>
   *
   * This improves performance by a meaningful amount.
   *
   * This isn't properly implemented. What we should be doing in the cssInterop function is generating a new component
   * that matches the type of the original component (e.g Function components should just be function components, nof ForwardRefs)
   * and passing a flag down if the component is composable.
   */
  if (component === baseComponent) {
    // switch (getComponentType(component)) {
    //   case "forwardRef": {
    //     const ref = props.ref;
    //     delete props.ref;
    //     return (component as any).render(props, ref);
    //   }
    //   case "function":
    //     return (component as any)(props);
    //   case "string":
    //   case "object":
    //   case "class":
    //   case "unknown":
    return createElement(component, props);
    // }
  } else {
    /*
     * Class/Object/String components are not composable, so they are added to the tree as normal
     */
    return createElement(component, props);
  }
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

  const { default: Animated, useAnimatedStyle } =
    require("react-native-reanimated") as typeof import("react-native-reanimated");

  let AnimatedComponent = Animated.createAnimatedComponent(
    Component as React.ComponentClass,
  );

  /**
   * TODO: This wrapper shouldn't be needed, as we should just run the hook in the
   * original component. However, we get an error about running on the JS thread?
   */
  const CSSInteropAnimationWrapper = forwardRef((props: any, ref: any) => {
    /**
     * This code shouldn't be needed, but inline shared values are not working properly.
     * https://github.com/software-mansion/react-native-reanimated/issues/5296
     */
    const propStyle = props.style;
    const style = useAnimatedStyle(() => {
      const style: Record<string, any> = {};

      if (!propStyle) return style;

      for (const key of Object.keys(propStyle)) {
        const value = propStyle[key];

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
    }, [propStyle]);

    return createElement(AnimatedComponent, {
      ...props,
      style,
      ref,
    });
  });
  CSSInteropAnimationWrapper.displayName = `CSSInteropAnimationWrapper(${
    Component.displayName ?? Component.name
  })`;

  animatedCache.set(Component, CSSInteropAnimationWrapper);

  return CSSInteropAnimationWrapper;
}

function printUpgradeWarning(
  warning: string,
  originalProps: Record<string, any> | null | undefined,
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
    if (originalProps) {
      console.warn(
        `The previous warning was caused by a component with these props: ${JSON.stringify(
          Object.keys(originalProps),
        )}. Some props could not be stringified, so only the keys are shown.`,
      );
    }
  }
}
