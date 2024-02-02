import { ComponentType, createElement, forwardRef, useRef } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { containerContext, variableContext } from "./globals";

import type { ComponentState } from "./native-interop";
import { observable } from "../observable";

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

export function renderComponent(
  component: ComponentType<any>,
  state: ComponentState,
  props: Record<string, any>,
  originalProps: Record<string, any>,
  variables: Record<string, any>,
  containers: Record<string, any>,
) {
  const shouldWarn = state.upgrades.canWarn;
  const isContainer = state.upgrades.containers;

  if (state.interaction.active || isContainer) {
    state.interaction.active ??= observable(false);
    props.onPressIn = (event: unknown) => {
      originalProps.onPressIn?.(event);
      state.interaction.active!.set(true);
    };
    props.onPressOut = (event: unknown) => {
      // console.log("----------------");
      originalProps.onPressOut?.(event);
      state.interaction.active!.set(false);
    };
  }
  if (state.interaction.hover || isContainer) {
    state.interaction.hover ??= observable(false);
    props.onHoverIn = (event: unknown) => {
      originalProps.onHoverIn?.(event);
      state.interaction.hover!.set(true);
    };
    props.onHoverOut = (event: unknown) => {
      originalProps.onHoverOut?.(event);
      state.interaction.hover!.set(false);
    };
  }

  if (state.interaction.focus || isContainer) {
    state.interaction.focus ??= observable(false);
    props.onFocus = (event: unknown) => {
      originalProps.onFocus?.(event);
      state.interaction.focus!.set(true);
    };
    props.onBlur = (event: unknown) => {
      originalProps.onBlur?.(event);
      state.interaction.focus!.set(false);
    };
  }
  /**
   * Some React Native components (e.g Text) will not apply state event handlers
   * if `onPress` is not defined.
   */
  if (
    state.interaction.active ||
    state.interaction.hover ||
    state.interaction.focus
  ) {
    props.onPress = (event: unknown) => {
      originalProps.onPress?.(event);
    };
  }

  if (state.interaction.layout || isContainer) {
    state.interaction.layout ??= observable([0, 0]);
    props.onLayout = (event: LayoutChangeEvent) => {
      originalProps.onLayout?.(event);
      const layout = event.nativeEvent.layout;
      const [width, height] = state.interaction.layout!.get() ?? [0, 0];
      if (layout.width !== width || layout.height !== height) {
        state.interaction.layout!.set([layout.width, layout.height]);
      }
    };
  }

  // TODO: We can probably remove this in favor of using `new Pressability()`
  if (
    component === View &&
    (state.interaction.hover ||
      state.interaction.active ||
      state.interaction.focus)
  ) {
    component = Pressable;
    if (shouldWarn && state.upgrades.pressable === UpgradeState.NONE) {
      printUpgradeWarning(
        `Converting View to Pressable should only happen during the initial render otherwise it will remount the View.\n\nTo prevent this warning avoid adding styles which use pseudo-classes (e.g :hover, :active, :focus) to View components after the initial render, or change the View to a Pressable`,
        originalProps,
      );
    }
    state.upgrades.pressable = UpgradeState.UPGRADED;
  }

  if (state.upgrades.animated) {
    if (shouldWarn && state.upgrades.animated === UpgradeState.NONE) {
      printUpgradeWarning(
        `Converting component to animated component should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding animation/transition styles to components after the initial render, or add a default style that sets "animation: none", "transition-property: none"`,
        originalProps,
      );
    }
    state.upgrades.animated = UpgradeState.UPGRADED;
    component = createAnimatedComponent(component);
  }

  if (state.upgrades.variables) {
    if (
      shouldWarn &&
      state.upgrades.variables === UpgradeState.SHOULD_UPGRADE
    ) {
      printUpgradeWarning(
        `Making a component inheritable should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding CSS variables or 'container' styles to components after the initial render, or ensure it has a default style that sets either a CSS variable, "container: none" or "container-type: none"`,
        originalProps,
      );
    }
    state.upgrades.variables = UpgradeState.UPGRADED;

    props = {
      value: variables,
      children: createElement(component, props),
    };
    component = variableContext.Provider;
  }

  if (state.upgrades.containers) {
    if (
      shouldWarn &&
      state.upgrades.containers === UpgradeState.SHOULD_UPGRADE
    ) {
      printUpgradeWarning(
        `Making a component inheritable should only happen during the initial render otherwise it will remount the component.\n\nTo prevent this warning avoid dynamically adding CSS variables or 'container' styles to components after the initial render, or ensure it has a default style that sets either a CSS variable, "container: none" or "container-type: none"`,
        originalProps,
      );
    }
    state.upgrades.containers = UpgradeState.UPGRADED;

    props = {
      value: containers,
      children: createElement(component, props),
    };
    component = containerContext.Provider;
  }

  // After the initial render, the user shouldn't upgrade the component. Avoid warning in production
  state.upgrades.canWarn = process.env.NODE_ENV !== "production";

  return createElement(component, props);
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
