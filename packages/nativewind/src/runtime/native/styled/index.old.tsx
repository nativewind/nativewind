/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { isFragment } from "react-is";

import {
  ReactNode,
  ComponentType,
  forwardRef,
  useContext,
  useMemo,
  Children,
  isValidElement,
  createContext,
  cloneElement,
  useReducer,
  ReactElement,
} from "react";

import { useInteraction } from "./use-interaction";
import { withStyledProps } from "./with-styled-props";
import { ConditionalStateRecord, withConditionals } from "./with-conditionals";

import {
  subscribeToStyleSheet,
  getStyleSet,
  getChildClasses,
} from "../stylesheet/runtime";
import { Styled, StyledOptions } from "../../types/styled";
import { variants, VariantsConfig } from "../../variants";

const groupContent = createContext<ConditionalStateRecord>({});

export const styled: Styled = <
  T,
  C,
  PAdd extends string,
  PRemove extends keyof T & string
>(
  Component: ComponentType<T>,
  styledBaseClassNameOrOptions?: string | StyledOptions<T, C, PAdd, PRemove>,
  maybeOptions?: StyledOptions<T, C, PAdd, PRemove>
) => {
  const {
    props: propsToTransform,
    defaultProps,
    ...cvaOptions
  } = typeof styledBaseClassNameOrOptions === "object"
    ? styledBaseClassNameOrOptions
    : maybeOptions ?? ({} as StyledOptions<T, C, PAdd, PRemove>);

  const classGenerator = variants(cvaOptions as VariantsConfig<C>);

  const Styled = forwardRef<unknown, any>((props, ref) => {
    const generatedClassName = classGenerator(props);

    if (!generatedClassName && !propsToTransform) {
      return <Component ref={ref} {...props} />;
    }

    return (
      <StyledComponent
        ref={ref}
        component={Component}
        propsToTransform={propsToTransform}
        {...props}
        tw={generatedClassName}
      />
    );
  });
  if (typeof Component !== "string") {
    Styled.displayName = `NativeWind.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  Styled.defaultProps = defaultProps;

  return Styled;
};

const initialComponentState = {
  hover: false,
  active: false,
  focus: false,
};
export type ComponentState = typeof initialComponentState;
export type ComponentStateAction = {
  type: keyof ComponentState;
  value: boolean;
};

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
  const [componentState, componentStateDispatch] = useReducer(
    (state: ComponentState, action: ComponentStateAction) => {
      switch (action.type) {
        case "hover":
        case "active":
        case "focus": {
          return { ...state, [action.type]: action.value };
        }
        default: {
          throw new Error("Unknown action");
        }
      }
    },
    initialComponentState
  );

  /**
   * Resolve the props/classProps/spreadProps options
   */
  const styledProps = withStyledProps({
    transformConfig: propsToTransform,
    componentState,
    props: componentProps,
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
  const classesToInherit = getChildClasses(className);
  if (classesToInherit && children) {
    children = flattenChildren(children).map((child, nthChild, children) => {
      if (isValidElement(child)) {
        const childPropClassName = child.props.className ?? child.props.tw;
        const childClassName = childPropClassName
          ? `${classesToInherit} ${childPropClassName}`
          : classesToInherit;

        return isNativeWindComponent(child) ? (
          cloneElement(child, {
            nthChild: nthChild + 1,
            lastChild: children.length - 1 === nthChild,
            className: childClassName,
          } as Record<string, unknown>)
        ) : (
          <StyledComponent
            key={child.key}
            component={child.type}
            nthChild={nthChild + 1}
            lastChild={children.length - 1 === nthChild}
            {...child.props}
            className={childClassName}
          />
        );
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

  let reactNode: ReactElement = <Component {...props}>{children}</Component>;

  /**
   * Determine if we need to wrap element in Providers
   */
  if (typeof interactionMeta.group === "string") {
    reactNode = (
      <groupContent.Provider
        value={{
          ...stateInheritance,
          [interactionMeta.group]: componentState,
        }}
      >
        {reactNode}
      </groupContent.Provider>
    );
  }

  return reactNode;
});

function isNativeWindComponent(node: unknown) {
  return (node as any).displayName?.startsWith("NativeWind");
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
