import { createElement, FC, ComponentProps } from "react";

import { Component, StyledProps, StyledPropsWithKeys } from "./utils/styled";
import { ComponentContext } from "./context/component";
import { useInteraction } from "./use-interaction";
import { withStyledChildren } from "./with-styled-children";
import { withStyledProps } from "./with-styled-props";
import { useTailwind } from "./use-tailwind";

export interface StyledOptions<P> {
  props?: false | Array<keyof P & string>;
}

/*
 * Normal usage
 */
export function styled<T>(
  Component: Component<T>,
  options?: { props?: false | undefined }
): FC<StyledProps<T>>;
/**
 * Transform extra props
 */
export function styled<T, K extends keyof T & string>(
  Component: Component<T>,
  options: { props: Array<K> }
): FC<StyledPropsWithKeys<T, K>>;
/**
 * Actual implementation
 */
export function styled<T>(
  Component: Component<T>,
  { props: propsToTransform }: StyledOptions<T> = {}
) {
  function Styled({
    className,
    tw: twClassName,
    style: styleProp,
    children: componentChildren,
    ...componentProps
  }: StyledProps<T>) {
    const { hover, focus, active, ...handlers } = useInteraction({
      className,
      ...componentProps,
    });

    const classes = twClassName ?? className ?? "";

    const { childStyles, ...styledProps } = withStyledProps({
      tw: useTailwind({
        hover,
        focus,
        active,
      }),
      classes,
      styleProp,
      propsToTransform,
      componentProps,
    });

    const children = childStyles
      ? withStyledChildren({
          componentChildren,
          childStyles,
        })
      : componentChildren;

    const element = createElement(Component, {
      ...componentProps,
      ...handlers,
      ...styledProps,
      children,
    } as unknown as T);

    return !classes.split(/\s+/).includes("component")
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
