import {
  ComponentType,
  createElement,
  forwardRef,
  useMemo,
  useRef,
} from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { ComponentState } from "../api.native";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import { inheritanceContext } from "./inherited-context";
import { defaultValues } from "./resolve-value";

const animatedCache = new Map<
  ComponentType<any> | string,
  ComponentType<any>
>();

export const UpgradeState = {
  NONE: 0,
  UPGRADED: 1,
  WARNED: 2,
};

export function renderComponent(
  component: ComponentType<any>,
  state: ComponentState,
  props: Record<string, any>,
  originalProps: Record<string, any>,
  resetContext: boolean,
) {
  const shouldWarn = state.upgradeWarning.canWarn;

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
  /**
   * Some React Native components (e.g Text) will not apply state event handlers
   * if `onPress` is not defined.
   */
  if (state.active || state.hover || state.focus) {
    props.onPress = (event: unknown) => {
      originalProps.onPress?.(event);
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

  // TODO: We can probably remove this in favor of using `new Pressability()`
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
   * This is a hack to delay firing state updates for other components until we have finished
   * rendering. The `key` property will only be access by React after rendering is complete.
   *
   * Libraries like Preact implement this by Dispatcher tricks. I think this is a bit simpler may might be more fragile.
   */
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
    useMemo(() => {
      for (const [key, value] of Object.entries(props.style) as [
        string,
        any,
      ][]) {
        if (key === "transform") {
          fallbackStyle.transform = value.flatMap((v: any) => {
            const [key, value] = Object.entries(v)[0] as any;
            return { [key]: value };
          });
        } else if (
          typeof value === "object" &&
          "_isReanimatedSharedValue" in value == false
        ) {
          for (const subKey of Object.keys(value)) {
            fallbackStyle[key][subKey] = defaultValues[subKey];
          }
        } else {
          fallbackStyle[key] = defaultValues[key];
        }
      }
    }, [props.style]);

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
