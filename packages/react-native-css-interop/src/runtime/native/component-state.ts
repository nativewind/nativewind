import { ComponentType, createContext, createElement, forwardRef } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { DEFAULT_CONTAINER_NAME } from "../../shared";
import { Interaction, NormalizedOptions, ReactComponent } from "../../types";
import { Signal, createSignal, interopGlobal } from "../signals";
import { globalVariables } from "./globals";
import { PropState } from "./prop-state";

export type InheritedParentContext = Pick<
  ComponentState,
  "getVariable" | "getContainer" | "interaction" | "layout"
>;

export const inheritanceContext = createContext<InheritedParentContext>({
  interaction: {},
  getContainer() {
    return undefined;
  },
  getVariable(name: string) {
    return globalVariables.root.get(name)?.get();
  },
});

const UpgradeState = {
  NONE: 0,
  UPGRADED: 1,
  WARNED: 2,
};

export class ComponentState {
  propStates = new Set<PropState>();
  propsToDelete = new Set<string>();

  upgradeWarning = {
    animated: UpgradeState.NONE,
    context: UpgradeState.NONE,
    pressable: UpgradeState.NONE,
    shouldPrintUpgradeWarnings: false,
  };

  requiresLayout = false;
  layout?: Signal<[number, number] | undefined>;
  interaction: Interaction = {};

  /**
   * The context is shared across all children and allows them to access inherited variables and containers.
   * We avoid updating this to prevent unnecessary rerenders. It should only be updated when a new container and/or variable is added
   */
  context?: InheritedParentContext;
  resetContext = false;

  isAnimated = false;

  constructor(
    private component: ReactComponent<any>,
    private parent: InheritedParentContext,
    rerender: () => void,
    options: NormalizedOptions,
    private testId?: string,
  ) {
    for (const [target, source, nativeStyleToProp] of options.config) {
      if (target !== source) {
        this.propsToDelete.add(source);
      }
      this.propStates.add(
        new PropState(
          this,
          parent,
          target,
          source,
          rerender,
          Object.entries(nativeStyleToProp || {}),
          `${this.testId}:${source}`,
        ),
      );
    }
  }

  /**
   * Variables
   *
   * Variables are shared across all source props. This is due to how we implemented
   * inheritance as a single React Context. There might be a better way to do this,
   * but it get confusing. E.g should the child View inherit the parent containerStyle's variables?
   */
  variables = new Map<string, Signal<any>>();
  getVariable(name: string) {
    let value: any = undefined;
    value ??= this.variables.get(name)?.get();
    value ??= globalVariables.universal.get(name)?.get();
    value ??= this.parent.getVariable(name);
    return value;
  }
  setVariable(name: string, value: any) {
    const existing = this.variables.get(name);
    if (!existing) {
      this.resetContext = true;
      this.variables.set(name, createSignal(value, `${this.testId}:${name}`));
    } else {
      existing.set(value);
    }
  }

  /**
   * Containers
   */
  container?: Signal<InheritedParentContext>;
  containerNames = new Set<string>();
  getContainer(name: string): InheritedParentContext | undefined {
    const hasName =
      this.containerNames.has(name) || name === DEFAULT_CONTAINER_NAME;

    if (this.container && hasName) {
      return this.container.get() ?? this.parent.getContainer(name);
    } else {
      return this.parent.getContainer(name);
    }
  }
  setContainer(name: string) {
    this.interaction.active ??= createSignal(false, `${this.testId}:__active`);
    this.interaction.hover ??= createSignal(false, `${this.testId}:__hover`);
    this.interaction.focus ??= createSignal(false, `${this.testId}:__focus`);
    this.layout ??= createSignal<[number, number] | undefined>(
      undefined,
      `${this.testId}:__layout`,
    );
    this.requiresLayout = true;
    this.containerNames.add(name);
    if (!this.container?.peek()) {
      this.resetContext = true;
      this.container = createSignal<InheritedParentContext>(
        this,
        `${this.testId}:__container:${name}`,
      );
    }
  }
  removeContainers() {
    this.containerNames.clear();
    this.container?.set(undefined);
    /**
     * We use
     */
    if (!this.context) {
      this.resetContext = true;
    }
  }

  render(
    parent: InheritedParentContext,
    originalProps: Record<string, any>,
    ref: any,
  ) {
    this.resetContext = this.parent !== parent;
    this.parent = parent;
    this.requiresLayout = false;
    this.containerNames.clear();

    const seenVariables = new Set();

    let props: Record<string, any> = {
      ...originalProps,
      ref,
    };
    for (const signal of this.propStates) {
      Object.assign(props, signal.getProps(parent, originalProps));
      for (const name of signal.seenVariables) {
        seenVariables.add(name);
      }
    }

    for (const prop of this.propsToDelete) {
      delete props[prop];
    }

    this.appendEventHandlers(props, originalProps);
    this.processContainers();

    for (const name of this.variables.keys()) {
      if (!seenVariables.has(name)) {
        this.variables.get(name)?.set(undefined); // This will cause the children to rerender
        this.variables.delete(name);
      }
    }

    return this.renderElement(props, originalProps);
  }

  private appendEventHandlers(
    props: Record<string, any>,
    originalProps: Record<string, any>,
  ) {
    const interaction = this.interaction;
    if (interaction.active) {
      props.onPressIn = (event: unknown) => {
        originalProps.onPressIn?.(event);
        interaction.active!.set(true);
      };
      props.onPressOut = (event: unknown) => {
        originalProps.onPressOut?.(event);
        interaction.active!.set(false);
      };
    }

    if (interaction.hover) {
      props.onHoverIn = (event: unknown) => {
        originalProps.onHoverIn?.(event);
        interaction.hover!.set(true);
      };
      props.onHoverOut = (event: unknown) => {
        originalProps.onHoverOut?.(event);
        interaction.hover!.set(false);
      };
    }

    if (interaction.focus) {
      props.onFocus = (event: unknown) => {
        originalProps.onFocus?.(event);
        interaction.focus!.set(true);
      };
      props.onBlur = (event: unknown) => {
        originalProps.onBlur?.(event);
        interaction.focus!.set(false);
      };
    }

    /**
     * Some React Native components (e.g Text) will not apply interaction event handlers
     * if `onPress` is not defined.
     */
    if (interaction.active || interaction.hover || interaction.focus) {
      props.onPress = (event: unknown) => {
        originalProps.onPress?.(event);
      };
    }

    /**
     * Some signals may require a layout to be calculated, so add the callback
     */
    if (this.requiresLayout) {
      props.onLayout = (event: LayoutChangeEvent) => {
        originalProps.onLayout?.(event);

        this.layout ??= createSignal<[number, number] | undefined>(
          undefined,
          `${this.testId}:__layout`,
        );

        const layout = event.nativeEvent.layout;
        const [width, height] = this.layout.peek() ?? [0, 0];
        if (layout.width !== width || layout.height !== height) {
          this.layout.set([layout.width, layout.height]);
        }
      };
    }
  }

  private processContainers() {
    /**
     * If we were a container in the previous render, but not in the current
     * we need to clear the container signal.
     */
    if (this.containerNames.size === 0 && this.container) {
      this.container.set(undefined);
    }
  }

  /**
   * Creates a the React Element and also "upgrades" the component if needed.
   *
   * Upgrading is a one-way process and should only happen during the initial render.
   * If it upgrades later, all state within the component is lost.
   */
  private renderElement(
    props: Record<string, any>,
    originalProps: Record<string, any>,
  ) {
    let component = this.component;
    const shouldWarn = this.upgradeWarning.shouldPrintUpgradeWarnings;

    // TODO: We can probably remove this in favor of using `new Pressability()`
    if (
      this.component === View &&
      (this.interaction.active ||
        this.interaction.hover ||
        this.interaction.focus)
    ) {
      component = Pressable;
      if (shouldWarn && this.upgradeWarning.pressable === UpgradeState.NONE) {
        console.warn(
          `CssInterop upgrade warning: Converting View to Pressable is a one-way process and should only happen during the initial render otherwise it will remount the View. To prevent this warning avoid adding styles which use pseudo-classes (e.g :hover, :active, :focus) to View components after the initial render, or change the View to a Pressable.`,
        );
      }
      this.upgradeWarning.pressable = UpgradeState.UPGRADED;
    }

    if (this.isAnimated) {
      if (shouldWarn && this.upgradeWarning.animated === UpgradeState.NONE) {
        console.warn(
          `CssInterop upgrade warning: Converting component to animated component is a one-way process and should only happen during the initial render otherwise it will remount the component.  To prevent this warning avoid dynamically adding animation/transition styles to components after the initial render, or add a default style that sets "animation: none", "transition-property: none".`,
        );
      }
      this.upgradeWarning.animated = UpgradeState.UPGRADED;
      component = createAnimatedComponent(component);
    }

    if (this.context || this.resetContext) {
      if (shouldWarn && this.upgradeWarning.context === UpgradeState.NONE) {
        console.warn(
          `CssInterop upgrade warning: Making a component inheritable is a one-way process and should only happen during the initial render otherwise it will remount the component. To prevent this warning avoid dynamically adding CSS variables or 'container' styles to components after the initial render, or ensure it has a default style that sets either a CSS variable, "container: none" or "container-type: none"`,
        );
      }
      this.upgradeWarning.context = UpgradeState.UPGRADED;

      if (this.resetContext) {
        this.context = {
          getContainer: this.getContainer.bind(this),
          getVariable: this.getVariable.bind(this),
          interaction: this.interaction,
        };
      }

      props = {
        value: this.context,
        children: createElement(component, props),
      };
      component = inheritanceContext.Provider;
    }

    // After the initial render, the user shouldn't upgrade the component
    this.upgradeWarning.shouldPrintUpgradeWarnings =
      process.env.NODE_ENV !== "production";

    /**
     * This is a hack to delay firing state updates for other components until we have finished
     * rendering. The `key` property will only be access by React after rendering is complete.
     *
     * Libraries like Preact implement this by Dispatcher tricks. I think this is a bit simpler may might be more fragile.
     */
    const element = createElement(component, props);
    return {
      ...element,
      get key() {
        interopGlobal.delayUpdates = false;
        if (interopGlobal.delayedEvents.size) {
          for (const sub of interopGlobal.delayedEvents) {
            sub();
          }
          interopGlobal.delayedEvents.clear();
        }
        return element.key;
      },
    };
  }

  cleanup() {
    for (const source of this.propStates) {
      source.cleanup();
    }
  }
}

const animatedCache = new Map<
  ComponentType<any> | string,
  ComponentType<any>
>();
export function createAnimatedComponent(Component: ComponentType<any>): any {
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
    /**
     * This code shouldn't be needed, but inline shared values are not working properly.
     * https://github.com/software-mansion/react-native-reanimated/issues/5296
     */
    const style = useAnimatedStyle(() => {
      const style: any = {};
      const entries = Object.entries(props.style ?? {});

      for (const [key, value] of entries as any) {
        if (typeof value === "object" && "value" in value) {
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
