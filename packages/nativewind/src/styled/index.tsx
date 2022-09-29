import {
  createElement,
  ReactNode,
  ComponentType,
  forwardRef,
  RefAttributes,
  ForwardedRef,
  ClassAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  useContext,
  useMemo,
  Children,
  isValidElement,
  ComponentPropsWithRef,
  ComponentProps,
} from "react";
import { NativeWindStyleSheet } from "../style-sheet";
import { InteractionProps, useInteraction } from "./use-interaction";
import { withStyledProps } from "./with-styled-props";
import { StyleProp } from "react-native";
import { GroupContext, ScopedGroupContext } from "./group-context";
import { useComponentState } from "./use-component-state";
import { isFragment } from "react-is";
import { Style } from "../postcss/types";

export interface StyledOptions<
  T,
  P extends keyof T = never,
  C extends keyof T = never
> {
  props?: Partial<Record<P, keyof Style | true>>;
  classProps?: C[];
  baseClassName?: string;
}

export type StyledProps<P> = P & {
  className?: string;
  tw?: string;
  baseClassName?: string;
  baseTw?: string;
};

type ForwardRef<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type InferRef<T> = T extends RefAttributes<infer R> | ClassAttributes<infer R>
  ? R
  : unknown;

/**
 * Default
 */
export function styled<T>(
  Component: ComponentType<T>
): ForwardRef<InferRef<T>, StyledProps<T>>;

/**
 * Base className
 */
export function styled<T>(
  Component: ComponentType<T>,
  baseClassName: string
): ForwardRef<InferRef<T>, StyledProps<T>>;

/**
 * Only options
 */
export function styled<T, P extends keyof T, C extends keyof T>(
  Component: ComponentType<T>,
  options: StyledOptions<T, P, C>
): ForwardRef<
  InferRef<T>,
  StyledProps<{ [key in keyof T]: key extends P ? T[key] | string : T[key] }>
>;

/**
 * Base className w/ options
 */
export function styled<T, P extends keyof T, C extends keyof T>(
  Component: ComponentType<T>,
  baseClassName: string,
  options: StyledOptions<T, P, C>
): ForwardRef<
  InferRef<T>,
  StyledProps<{ [key in keyof T]: key extends P ? T[key] | string : T[key] }>
>;

/**
 * Actual implementation
 */
export function styled<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { style?: StyleProp<any>; children?: ReactNode | undefined },
  P extends keyof T,
  C extends keyof T
>(
  Component: ComponentType<T>,
  styledBaseClassNameOrOptions?: string | StyledOptions<T, P, C>,
  maybeOptions: StyledOptions<T, P, C> = {}
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
    }: StyledProps<T>,
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
    const { styledProps, className } = withStyledProps<T, P, C>({
      className: classNameWithDefaults,
      propsToTransform,
      classProps,
      componentState,
      componentProps: componentProps as unknown as Record<
        P | C | string,
        string
      >,
    });

    /**
     * Resolve the className->style
     */
    const {
      styles,
      meta = {},
      childClasses,
    } = NativeWindStyleSheet.useSync(className, {
      ...componentState,
      ...groupContext,
      ...scopeGroupContext,
    });

    const style = useMemo(() => {
      if (styles) {
        if (styles.length > 0 && inlineStyles) {
          return [...styles, inlineStyles];
        } else if (styles.length > 1) {
          return styles;
        } else if (styles.length === 1) {
          return styles[0];
        }
      } else if (inlineStyles) {
        return inlineStyles;
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
    let reactNode: ReactNode = createElement(Component, {
      ...componentProps,
      ...handlers,
      ...styledProps,
      style,
      children,
      ref,
    } as unknown as T);

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

export type StyledComponentProps<P> = StyledProps<P> & {
  component: React.ComponentType<P>;
};

export const StyledComponent = forwardRef(({ component, ...options }, ref) => {
  const Component = useMemo(() => styled(component), [component]);
  return (
    <Component
      {...(options as unknown as ComponentProps<typeof Component>)}
      ref={ref as ComponentPropsWithRef<typeof Component>["ref"]}
    />
  );
}) as <T, P>(
  props: StyledComponentProps<P> & React.RefAttributes<T>
) => React.ReactElement | null;

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
