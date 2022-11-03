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
import { cva } from "class-variance-authority";

import type { StyledOptions } from "../index";

import { useInteraction } from "./use-interaction";
import { withStyledProps } from "./with-styled-props";
import { useComponentState } from "./use-component-state";
import { ConditionalStateRecord, withConditionals } from "./with-conditionals";

import {
  getChildClasses,
  getStyleSet,
  subscribeToStyleSheet,
} from "../../style-sheet/native/runtime";

const groupContent = createContext<ConditionalStateRecord>({});

export function styled(
  Component: ComponentType,
  styledBaseClassNameOrOptions?: string | StyledOptions<any, any>,
  maybeOptions: StyledOptions<any, any> = {}
) {
  const {
    classProps,
    class: baseClassName = "",
    props: propsToTransform,
    ...cvaOptions
  } = typeof styledBaseClassNameOrOptions === "object"
    ? styledBaseClassNameOrOptions
    : maybeOptions;

  const classGenerator = cva(
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : baseClassName,
    cvaOptions
  );

  const Styled = forwardRef<unknown, any>(
    ({ className, tw, ...props }, ref) => {
      const generatedClassName = classGenerator({
        class: tw ?? className,
        ...props,
      });

      if (!generatedClassName) {
        return <Component ref={ref} {...props} />;
      }

      return (
        <StyledComponent
          ref={ref}
          component={Component}
          propsToTransform={propsToTransform}
          className={generatedClassName}
          {...props}
        />
      );
    }
  );
  if (typeof Component !== "string") {
    Styled.displayName = `NativeWind.${
      Component.displayName || Component.name || "NoName"
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
  /**
   * Inherit state from a parent group
   */
  const stateInheritance = useContext(groupContent);

  /**
   * Get the hover/focus/active state of this component
   */
  const [componentState, componentStateDispatch] = useComponentState();

  /**
   * Resolve the props/classProps/spreadProps options
   */
  const styledProps = withStyledProps({
    propsToTransform,
    classProps,
    componentState,
    componentProps,
  });

  /**
   * Filter classes that don't apply (eg hover classes)
   */
  const { className, interactionMeta } = withConditionals(propClassName, {
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
    () => getStyleSet(className),
    () => getStyleSet(className)
  );

  /**
   * Determine if we need event handlers for our styles
   */
  const handlers = useInteraction(
    componentStateDispatch,
    interactionMeta,
    componentProps
  );

  /**
   * Resolve the child styles
   */
  const childClasses = getChildClasses(className);
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
    } else if (inlineStyles) {
      return inlineStyles;
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
  if (typeof interactionMeta.group === "string") {
    reactNode = createElement(groupContent.Provider, {
      children: reactNode,
      value: {
        ...stateInheritance,
        [interactionMeta.group]: componentState,
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

function flattenChildren(
  children: ReactNode | ReactNode[],
  keys: Array<string | number> = []
): ReactNode[] {
  return Children.toArray(children).flatMap((node, index) => {
    if (isFragment(node)) {
      return flattenChildren(node.props.children, [...keys, node.key || index]);
    } else if (typeof node === "string" || typeof node === "number") {
      return [node];
    } else if (isValidElement(node)) {
      return [
        cloneElement(node, {
          key: `${keys.join(".")}.${node.key?.toString()}`,
        }),
      ];
    } else {
      return [];
    }
  });
}
