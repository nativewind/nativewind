import {
  createElement,
  FC,
  ComponentClass,
  PropsWithChildren,
  ComponentProps,
} from "react";
import { StyleProp } from "react-native";
import { RWNCssStyle, useTailwind } from "./use-tailwind";
import { useInteraction } from "./use-interaction";
import { ComponentContext } from "./context";
import { useStyledProps } from "./use-styled-props";
import { useStyledChildren } from "./use-styled-children";

type StyledProps<P, T> = PropsWithChildren<
  P & {
    className?: string;
    tw?: string;
    style?: StyleProp<T | RWNCssStyle>;
  }
>;

type Component<P extends { style?: StyleProp<T> | undefined }, T> =
  | string
  | FC<P & { style?: StyleProp<T> }>
  | ComponentClass<P>;

export interface StyledOptions<P> {
  props?: boolean | Array<keyof P & string>;
}

/*
 * Transform no props
 */
export function styled<P extends { style?: StyleProp<T> }, T>(
  Component: Component<P, T>,
  options?: { props: false }
): FC<StyledProps<P, T>>;
/**
 * Transform extra props
 */
export function styled<
  P extends { style?: StyleProp<T> },
  T,
  K extends keyof P & string
>(
  Component: Component<P, T>,
  options: { props: Array<K> }
): FC<StyledProps<P & { [key in K]: P[key] | string }, T>>;
/**
 * Implementation
 */
export function styled<P extends { style?: StyleProp<T> }, T>(
  Component: Component<P, T>,
  { props: propsToTransform }: StyledOptions<P> = {}
) {
  function Styled({
    className,
    tw,
    style: componentStyles,
    children: componentChildren,
    ...componentProps
  }: StyledProps<P, T>) {
    const { hover, focus, active, ...handlers } = useInteraction({
      className,
      ...componentProps,
    });

    const classes = tw ?? className ?? "";

    const twCallback = useTailwind<T>({
      hover,
      focus,
      active,
      flatten: false,
    });

    const { childStyles, ...styledProps } = useStyledProps<T, keyof P & string>(
      {
        tw: twCallback,
        classes,
        componentStyles,
        propsToTransform,
        componentProps,
      }
    );

    const children = useStyledChildren({
      componentChildren,
      childStyles,
    });

    const element = createElement(Component, {
      ...componentProps,
      ...handlers,
      ...styledProps,
      children,
    } as unknown as P);

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

type StyledComponentProps<P extends { style?: StyleProp<T> }, T> = StyledProps<
  P,
  T
> & {
  component: Component<P, T>;
};

export function StyledComponent<P extends { style?: StyleProp<T> }, T>({
  component,
  ...options
}: StyledComponentProps<P, T>) {
  const Component = styled<P, T>(component);
  return <Component {...(options as P)} />;
}
