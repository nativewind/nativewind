import { ComponentProps, createElement, FC } from "react";
import { Component, StyledProps, StyledPropsWithKeys } from "./utils/styled";
import { ComponentContext } from "./context/component";
import { useInteraction } from "./use-interaction";
import { withStyledChildren } from "./with-styled-children";
import { withStyledProps } from "./with-styled-props";
import { useTailwind } from "./use-tailwind";
import { withClassNames } from "./with-class-names";
import { usePlatform } from "./context/platform";

export interface StyledOptions<P> {
  props?: Array<keyof P & string>;
  spreadProps?: Array<keyof P & string>;
  cssProps?: Array<keyof P & string>;
}

/**
 * Normal usage
 */
export function styled<T>(
  Component: Component<T>,
  options?: { props?: undefined; spreadProps?: undefined }
): FC<StyledProps<T>>;
/**
 * With either props or valueProps
 */
export function styled<T, K extends keyof T & string>(
  Component: Component<T>,
  options: { props?: Array<K>; spreadProps?: Array<K>; cssProps?: Array<K> }
): FC<StyledPropsWithKeys<T, K>>;
/**
 * Actual implementation
 */
export function styled<T>(
  Component: Component<T>,
  { props: propsToTransform, spreadProps, cssProps }: StyledOptions<T> = {}
) {
  function Styled({
    className,
    tw: twClassName,
    style: styleProp,
    children: componentChildren,
    ...componentProps
  }: StyledProps<T>) {
    const { platform, preview } = usePlatform();

    const { classes, allClasses, isComponent } = withClassNames({
      className,
      twClassName,
      componentProps,
      propsToTransform,
      spreadProps,
      cssProps,
    });

    const { hover, focus, active, ...handlers } = useInteraction({
      className: allClasses,
      isComponent,
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
      cssProps,
      preview,
    });

    const children = childStyles
      ? withStyledChildren({
          componentChildren,
          childStyles,
        })
      : componentChildren;

    const element = createElement(Component, {
      ...handlers,
      ...styledProps,
      children,
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

  return Styled;
}
