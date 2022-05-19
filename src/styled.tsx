import { createElement, FC, ComponentProps } from "react";
import { StyleProp } from "react-native";

import { Component, StyledProps, StyledPropsWithKeys } from "./utils/styled";
import { ComponentContext } from "./context";
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
export function styled<
  Props extends { style?: StyleProp<StyleType> },
  StyleType
>(
  Component: Component<Props, StyleType>,
  options?: { props?: false | undefined }
): FC<StyledProps<Props, StyleType>>;
/**
 * Transform extra props
 */
export function styled<
  Props extends { style?: StyleProp<StyleType> },
  StyleType,
  KeyOfProps extends keyof Props & string
>(
  Component: Component<Props, StyleType>,
  options: { props: Array<KeyOfProps> }
): FC<StyledPropsWithKeys<Props, StyleType, KeyOfProps>>;
/**
 * Actual implementation
 */
export function styled<
  Props extends { style?: StyleProp<StyleType> },
  StyleType
>(
  Component: Component<Props, StyleType>,
  { props: propsToTransform }: StyledOptions<Props> = {}
) {
  function Styled({
    className,
    tw: twClassName,
    style: componentStyles,
    children: componentChildren,
    ...componentProps
  }: StyledProps<Props, StyleType>) {
    const { hover, focus, active, ...handlers } = useInteraction({
      className,
      ...componentProps,
    });

    const classes = twClassName ?? className ?? "";

    const { childStyles, ...styledProps } = withStyledProps<
      StyleType,
      keyof Props & string
    >({
      tw: useTailwind<StyleType>({
        hover,
        focus,
        active,
        flatten: false,
      }),
      classes,
      componentStyles,
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
    } as unknown as Props);

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
