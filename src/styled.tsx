import {
  ComponentProps,
  createElement,
  ReactNode,
  ComponentType,
  forwardRef,
  RefAttributes,
  ForwardedRef,
  ClassAttributes,
  ForwardRefExoticComponent,
  PropsWithoutRef,
} from "react";
import { StyledProps, StyledPropsWithKeys } from "./utils/styled";
import { ComponentContext } from "./context/component";
import { useInteraction } from "./use-interaction";
import { withStyledChildren } from "./with-styled-children";
import { withStyledProps } from "./with-styled-props";
import { useTailwind } from "./use-tailwind";
import { withClassNames } from "./with-class-names";
import { usePlatform } from "./context/platform";
import { StyleProp } from "react-native";

export interface StyledOptions<P> {
  props?: Array<keyof P & string>;
  spreadProps?: Array<keyof P & string>;
  classProps?: Array<keyof P & string>;
  supportsClassName?: boolean;
}

type ForwardRef<T, P> = ForwardRefExoticComponent<
  PropsWithoutRef<P> & RefAttributes<T>
>;

type InferRef<T> = T extends RefAttributes<infer R> | ClassAttributes<infer R>
  ? R
  : unknown;

/**
 * Normal usage
 */
export function styled<T>(
  Component: ComponentType<T>,
  options?: { props?: undefined; spreadProps?: undefined }
): ForwardRef<InferRef<T>, StyledProps<T>>;

/**
 * With either props or valueProps
 */
export function styled<T, K extends keyof T & string>(
  Component: ComponentType<T>,
  options: { props?: Array<K>; spreadProps?: Array<K>; classProps?: Array<K> }
): ForwardRef<InferRef<T>, StyledPropsWithKeys<T, K>>;

/**
 * Actual implementation
 */
export function styled<
  T extends { style?: StyleProp<unknown>; children?: ReactNode | undefined }
>(
  Component: ComponentType<T>,
  {
    props: propsToTransform,
    spreadProps,
    classProps,
    supportsClassName = false,
  }: StyledOptions<T> = {}
) {
  function Styled(
    {
      className,
      tw: twClassName,
      style: styleProp,
      children: componentChildren,
      ...componentProps
    }: StyledProps<T>,
    ref: ForwardedRef<unknown>
  ) {
    const { platform, preview } = usePlatform();

    const { classes, allClasses, isComponent, isParent } = withClassNames({
      className,
      twClassName,
      componentProps,
      propsToTransform,
      spreadProps,
      classProps,
    });

    const { hover, focus, active, ...handlers } = useInteraction({
      className: allClasses,
      isComponent,
      isParent,
      platform,
      preview,
      ...componentProps,
    });

    const tw = useTailwind({
      hover,
      focus,
      active,
    });

    const { childStyles, ...styledProps } = withStyledProps({
      tw,
      classes,
      styleProp,
      propsToTransform,
      componentProps,
      spreadProps,
      classProps,
      preview,
      supportsClassName,
    });

    const children = childStyles
      ? withStyledChildren({
          componentChildren,
          childStyles,
          isParent,
          parentHover: hover,
          parentFocus: focus,
          parentActive: active,
        })
      : componentChildren;

    const element = createElement(Component, {
      ...handlers,
      ...styledProps,
      children,
      ref,
    } as unknown as T);

    return !isComponent
      ? element
      : createElement<ComponentProps<typeof ComponentContext.Provider>>(
          ComponentContext.Provider,
          {
            children: element,
            value: { hover, focus, active },
          }
        );
  }

  if (typeof Component !== "string") {
    Styled.displayName = `TailwindCssReactNative.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  return forwardRef(Styled);
}
