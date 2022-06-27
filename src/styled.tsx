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
} from "react";
import { StyledProps, StyledPropsWithKeys } from "./utils/styled";
import { useInteraction } from "./use-interaction";
import { withStyledChildren } from "./with-styled-children";
import { withStyledProps } from "./with-styled-props";
import { useTailwind } from "./use-tailwind";
import { withClassNames } from "./with-class-names";
import { StyleProp } from "react-native";
import { StoreContext } from "./style-sheet-store";
import { IsolateGroupContext } from "./group-context";

export interface StyledOptions<P> {
  props?: Array<keyof P & string>;
  spreadProps?: Array<keyof P & string>;
  classProps?: Array<keyof P & string>;
  baseClassName?: string;
}

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
 * Base className w/ options
 */
export function styled<T, K extends keyof T & string>(
  Component: ComponentType<T>,
  baseClassName: string,
  options: StyledOptions<T> & {
    props?: Array<K>;
    spreadProps?: Array<K>;
    classProps?: Array<K>;
  }
): ForwardRef<InferRef<T>, StyledPropsWithKeys<T, K>>;

/**
 * Only options
 */
export function styled<T, K extends keyof T & string>(
  Component: ComponentType<T>,
  options: StyledOptions<T> & {
    props?: Array<K>;
    spreadProps?: Array<K>;
    classProps?: Array<K>;
  }
): ForwardRef<InferRef<T>, StyledPropsWithKeys<T, K>>;

/**
 * Actual implementation
 */
export function styled<
  T extends { style?: StyleProp<unknown>; children?: ReactNode | undefined }
>(
  Component: ComponentType<T>,
  styledBaseClassNameOrOptions?: string | StyledOptions<T>,
  maybeOptions: StyledOptions<T> = {}
) {
  const {
    props: propsToTransform,
    spreadProps,
    classProps,
  } = typeof styledBaseClassNameOrOptions === "object"
    ? styledBaseClassNameOrOptions
    : maybeOptions;

  const baseClassName =
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : maybeOptions?.baseClassName;

  function Styled(
    {
      className: propClassName,
      tw: twClassName,
      baseTw,
      style: styleProp,
      children: componentChildren,
      ...componentProps
    }: StyledProps<T>,
    ref: ForwardedRef<unknown>
  ) {
    const store = useContext(StoreContext);
    const isolateGroupContext = useContext(IsolateGroupContext);

    const { className, allClasses, isGroupIsolate, isParent } = withClassNames({
      baseClassName,
      propClassName,
      twClassName,
      baseTw,
      componentProps,
      propsToTransform,
      spreadProps,
      classProps,
    });

    const { hover, focus, active, ...handlers } = useInteraction({
      className: allClasses,
      isGroupIsolate,
      isParent,
      store,
      ...componentProps,
    });

    const { additionalStyles, ...styledProps } = withStyledProps({
      preprocessed: store.preprocessed,
      propsToTransform,
      componentProps,
      classProps,
    });

    const style = useTailwind(
      className,
      {
        hover,
        focus,
        active,
        ...isolateGroupContext,
      },
      styleProp,
      additionalStyles
    );

    const children = withStyledChildren({
      store,
      componentChildren,
      stylesArray: style,
      parentHover: isParent && hover,
      parentFocus: isParent && focus,
      parentActive: isParent && active,
    });

    const element = createElement(Component, {
      ...handlers,
      ...styledProps,
      style: style.length > 0 ? style : undefined,
      children,
      ref,
    } as unknown as T);

    if (isGroupIsolate) {
      return createElement(IsolateGroupContext.Provider, {
        children: element,
        value: {
          isolateGroupHover: hover,
          isolateGroupFocus: focus,
          isolateGroupActive: active,
        },
      });
    }

    return element;
  }

  if (typeof Component !== "string") {
    Styled.displayName = `TailwindCssReactNative.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  return forwardRef(Styled);
}
