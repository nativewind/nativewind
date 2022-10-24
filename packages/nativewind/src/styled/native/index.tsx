/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createElement,
  ReactNode,
  ComponentType,
  forwardRef,
  useContext,
  useMemo,
  Children,
  isValidElement,
  createContext,
} from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { isFragment } from "react-is";

import type { StyledOptions } from "../index";

import { InteractionProps, useInteraction } from "./use-interaction";
import { withStyledProps } from "./with-styled-props";
import { useComponentState } from "./use-component-state";
import { ConditionalStateRecord, withConditionals } from "./with-conditionals";
import {
  getChildClasses,
  getStyleSet,
  subscribeToStyleSheet,
} from "../../style-sheet/native/runtime";

const stateInheritanceContent = createContext<ConditionalStateRecord>({});

export function styled(
  component: ComponentType,
  styledBaseClassNameOrOptions?:
    | string
    | StyledOptions<Record<string, unknown>, string>,
  maybeOptions: StyledOptions<Record<string, unknown>, string> = {}
) {
  const { props: propsToTransform, classProps } =
    typeof styledBaseClassNameOrOptions === "object"
      ? styledBaseClassNameOrOptions
      : maybeOptions;

  const baseClassName =
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : maybeOptions?.baseClassName;

  const Styled = forwardRef((props, ref) => {
    return (
      <StyledComponent
        ref={ref}
        component={component}
        propsToTransform={propsToTransform}
        classProps={classProps}
        baseClassName={baseClassName}
        {...props}
      />
    );
  });
  if (typeof component !== "string") {
    Styled.displayName = `NativeWind.${
      component.displayName || component.name || "NoName"
    }`;
  }

  return Styled;
}

export const StyledComponent = forwardRef(
  (
    {
      component: Component,
      baseClassName,
      tw: twClassName,
      className: propClassName,
      propsToTransform,
      classProps,
      children,
      nthChild,
      style: inlineStyles,
      ...componentProps
    }: any,
    ref
  ) => {
    const stateInheritance = useContext(stateInheritanceContent);

    /**
     * Get the hover/focus/active state of this component
     */
    const [componentState, componentStateDispatch] = useComponentState();

    const classNameWithDefaults = [baseClassName, twClassName ?? propClassName]
      .filter(Boolean)
      .join(" ");

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
      ...stateInheritance,
      nthChild,
    });

    /**
     * Resolve the className->style
     */
    const styles = useSyncExternalStore(
      subscribeToStyleSheet,
      () => getStyleSet(actualClassName),
      () => getStyleSet(actualClassName)
    );

    /**
     * Determine if we need event handlers for our styles
     */
    const handlers = useInteraction(
      componentStateDispatch,
      meta,
      componentProps as InteractionProps
    );

    /**
     * Resolve the child styles
     */
    const childClasses = getChildClasses(actualClassName);
    if (childClasses && children) {
      children = flattenChildren(children)
        ?.filter(Boolean)
        .map((child, nthChild) => {
          if (isValidElement(child)) {
            return createElement(StyledComponent, {
              key: child.key,
              component: child.type,
              nthChild,
              ...child.props,
              className: [childClasses, child.props.className ?? child.props.tw]
                .filter(Boolean)
                .join(" "),
            });
          }

          return child;
        });
    }

    const style = useMemo(() => {
      const keys = Object.keys(styles).length;
      if (keys > 0 && inlineStyles) {
        return [styles, inlineStyles];
      } else if (keys > 0) {
        return styles;
      }
    }, [styles, inlineStyles]);

    /**
     * Pass the styles to the element
     */
    const props = {
      ...componentProps,
      ...handlers,
      ...styledProps,
      style,
      ref,
    };

    let reactNode: ReactNode = Array.isArray(children)
      ? createElement(Component, props, ...children)
      : createElement(Component, props, children);

    /**
     * Determine if we need to wrap element in Providers
     */
    if (typeof meta.group === "string") {
      reactNode = createElement(stateInheritanceContent.Provider, {
        children: reactNode,
        value: {
          ...stateInheritance,
          [meta.group]: componentState,
        },
      });
    }

    return reactNode;
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
