import {
  createElement,
  ReactNode,
  ComponentType,
  forwardRef,
  ForwardedRef,
  useContext,
  useMemo,
  Children,
  isValidElement,
} from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { isFragment } from "react-is";

import { InteractionProps, useInteraction } from "./use-interaction";
import { withStyledProps } from "./with-styled-props";
import { StyleProp } from "react-native";
import { GroupContext, ScopedGroupContext } from "./group-context";
import { useComponentState } from "./use-component-state";
import { withConditionals } from "./conditionals";
import {
  getChildClasses,
  getStyleSet,
  subscribeToStyleSheet,
} from "../../style-sheet/native/runtime";
import type { PropsWithClassName, StyledOptions } from "../index";

export function styled<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { style?: StyleProp<any>; children?: ReactNode | undefined },
  P extends keyof T
>(
  Component: ComponentType<T>,
  styledBaseClassNameOrOptions?: string | StyledOptions<T, P>,
  maybeOptions: StyledOptions<T, P> = {}
) {
  const { props: propsToTransform, classProps } =
    typeof styledBaseClassNameOrOptions === "object"
      ? styledBaseClassNameOrOptions
      : maybeOptions;

  const baseClassName =
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : maybeOptions?.baseClassName;

  function Styled(
    {
      className: propClassName = "",
      tw: twClassName,
      style: inlineStyles,
      children: componentChildren,
      ...componentProps
    }: PropsWithClassName<T>,
    ref: ForwardedRef<unknown>
  ) {
    const groupContext = useContext(GroupContext);
    const scopeGroupContext = useContext(ScopedGroupContext);

    const classNameWithDefaults = baseClassName
      ? `${baseClassName} ${twClassName ?? propClassName}`
      : twClassName ?? propClassName;

    /**
     * Get the hover/focus/active state of this component
     */
    const [componentState, dispatch] = useComponentState();

    /**
     * Resolve the props/classProps/spreadProps options
     */
    const { styledProps, className } = withStyledProps({
      className: classNameWithDefaults,
      propsToTransform,
      classProps,
      componentState,
      componentProps,
    });

    const { className: actualClassName, meta } = withConditionals(className, {
      ...componentState,
      ...groupContext,
      ...scopeGroupContext,
    });

    /**
     * Resolve the className->style
     */
    const styles = useSyncExternalStore(
      subscribeToStyleSheet,
      () => getStyleSet(actualClassName),
      () => getStyleSet(actualClassName)
    );

    const childClasses = getChildClasses(actualClassName);

    const style = useMemo(() => {
      const keys = Object.keys(styles).length;
      if (keys > 0 && inlineStyles) {
        return [styles, inlineStyles];
      } else if (keys > 0) {
        return styles;
      }
    }, [styles, inlineStyles]);

    /**
     * Determine if we need event handlers for our styles
     */
    const handlers = useInteraction(
      dispatch,
      meta,
      componentProps as InteractionProps
    );

    /**
     * Resolve the child styles
     */
    let children = componentChildren;
    if (childClasses && children) {
      children = flattenChildren(componentChildren)?.map((child) => {
        if (isValidElement(child)) {
          const props = child.props;
          return createElement(StyledComponent, {
            component: child,
            key: child.key,
            ...props,
            className: `${childClasses} ${props.className ?? props.tw ?? ""}`,
          });
        }

        return child;
      });
    }

    /**
     * Pass the styles to the element
     */
    const props = {
      ...componentProps,
      ...handlers,
      ...styledProps,
      style,
      ref,
    } as unknown as T;
    if (children) props.children = children;
    let reactNode: ReactNode = createElement(Component, props);

    /**
     * Determine if we need to wrap element in Providers
     */
    if (meta.group) {
      reactNode = createElement(GroupContext.Provider, {
        children: reactNode,
        value: {
          "group-hover": groupContext["group-hover"] || componentState.hover,
          "group-focus": groupContext["group-focus"] || componentState.focus,
          "group-active": groupContext["group-active"] || componentState.active,
        },
      });
    }

    if (meta.scopedGroup) {
      reactNode = createElement(ScopedGroupContext.Provider, {
        children: reactNode,
        value: {
          "scoped-group-hover": componentState.hover,
          "scoped-group-focus": componentState.focus,
          "scoped-group-active": componentState.active,
        },
      });
    }

    return reactNode;
  }

  if (typeof Component !== "string") {
    Styled.displayName = `NativeWind.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  return forwardRef(Styled);
}

export const StyledComponent = forwardRef(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ component, ...options }: any, ref) => {
    const Component = useMemo(() => styled(component), [component]);
    return <Component {...options} ref={ref} />;
  }
);

function flattenChildren(
  children: ReactNode | ReactNode[]
): ReactNode[] | undefined | null {
  return Children.toArray(children).flatMap((child) => {
    if (isFragment(child)) return flattenChildren(child.props.children);
    if (typeof child === "string" || typeof child === "number") {
      return child;
    }
    if (!child || !isValidElement(child)) return [];
    return child;
  });
}
