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
  cloneElement,
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
import { cva } from "class-variance-authority";

const stateInheritanceContent = createContext<ConditionalStateRecord>({});

export function styled(
  component: ComponentType,
  styledBaseClassNameOrOptions?: string | StyledOptions<any, any>,
  maybeOptions: StyledOptions<any, any> = {}
) {
  const {
    classProps,
    baseClassName = "",
    props: propsToTransform,
    ...cvaOptions
  } = typeof styledBaseClassNameOrOptions === "object"
    ? styledBaseClassNameOrOptions
    : maybeOptions;

  const defaultClassName =
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : baseClassName;

  const classGenerator = cva(defaultClassName, cvaOptions);

  const Styled = forwardRef<unknown, any>(
    ({ className, tw, ...props }, ref) => {
      const generatedClassName = classGenerator({
        class: tw ?? className,
        ...props,
      });

      return (
        <StyledComponent
          ref={ref}
          component={component}
          propsToTransform={propsToTransform}
          className={generatedClassName}
          {...props}
        />
      );
    }
  );
  if (typeof component !== "string") {
    Styled.displayName = `NativeWind.${
      component.displayName || component.name || "NoName"
    }`;
  }

  return Styled;
}

export const StyledComponent = forwardRef(function NativeWindStyledComponent(
  {
    component: Component,
    tw,
    className: propClassName,
    propsToTransform,
    classProps,
    children,
    nthChild,
    lastChild,
    style: inlineStyles,
    ...componentProps
  }: any,
  ref
) {
  const stateInheritance = useContext(stateInheritanceContent);

  /**
   * Get the hover/focus/active state of this component
   */
  const [componentState, componentStateDispatch] = useComponentState();

  /**
   * Resolve the props/classProps/spreadProps options
   */
  const { styledProps, className } = withStyledProps({
    className: tw ?? propClassName,
    propsToTransform,
    classProps,
    componentState,
    componentProps,
  });

  const { className: actualClassName, meta } = withConditionals(className, {
    ...componentState,
    ...stateInheritance,
    nthChild,
    lastChild,
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
    children = flattenChildren(children).map((child, nthChild, children) => {
      if (isValidElement(child)) {
        const mergedClassName = [
          childClasses,
          child.props.className ?? child.props.tw,
        ]
          .filter(Boolean)
          .join(" ");

        return isNativeWindComponent(child)
          ? cloneElement(child, {
              nthChild,
              lastChild: children.length - 1 === nthChild,
              className: mergedClassName,
            } as Record<string, unknown>)
          : createElement(StyledComponent, {
              key: child.key,
              component: child.type,
              nthChild,
              lastChild: children.length - 1 === nthChild,
              ...child.props,
              className: mergedClassName,
            });
      } else {
        return child;
      }
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
});

function isNativeWindComponent(node: ReactNode) {
  return (
    typeof node === "object" &&
    node &&
    "type" in node &&
    (node.type as unknown as Record<string, string>).displayName?.startsWith(
      "NativeWind"
    )
  );
}

function flattenChildren(children: ReactNode | ReactNode[]): ReactNode[] {
  return Children.toArray(children).flatMap((child) => {
    if (isFragment(child)) return flattenChildren(child.props.children);
    if (typeof child === "string" || typeof child === "number") {
      return child;
    }
    if (!child || !isValidElement(child)) return [];
    return child;
  });
}
