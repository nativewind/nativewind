/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSyncExternalStore } from "use-sync-external-store/shim";
import { isFragment } from "react-is";

import {
  ReactNode,
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
import { StyledComponent } from ".";

const groupContent = createContext<ConditionalStateRecord>({});

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

export default function useStyled(
  {
    component: Component,
    tw,
    className: propClassName,
    transformConfig,
    children,
    nthChild,
    lastChild,
    style: inlineStyles,
    ...componentProps
  }: any,
  ref: unknown
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
    transformConfig: transformConfig,
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
}

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
