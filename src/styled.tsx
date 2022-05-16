import {
  createElement,
  FunctionComponent,
  ComponentClass,
  PropsWithChildren,
  ComponentProps,
} from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTailwind } from "./use-tailwind";
import { useInteraction } from "./use-interaction";
import { ComponentContext } from "./context";
import { useStyledProps } from "./use-styled-props";
import { useStyledChildren } from "./use-styled-children";

type StyledProps<P> = PropsWithChildren<
  P & {
    className?: string;
    tw?: string;
    style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  }
>;

type Component<P> = string | FunctionComponent<P> | ComponentClass<P>;

export interface StyledOptions<P> {
  props?: boolean | Array<keyof P & string>;
}

// Transform no props
export function styled<P>(
  Component: Component<P>,
  options?: { props: false }
): FunctionComponent<StyledProps<P>>;
// Transform extra props
export function styled<P>(
  Component: Component<P>,
  options: { props: Array<keyof P & string> }
): FunctionComponent<StyledProps<P & Record<keyof P, string>>>;
// Transform all props
export function styled<P>(
  Component: Component<P>,
  options: { props: true }
): FunctionComponent<StyledProps<P & Record<keyof P, string>>>;
// Implementation
export function styled<P>(
  Component: Component<P>,
  { props: propsToTransform }: StyledOptions<P> = {}
) {
  function Styled({
    className,
    tw,
    style: componentStyles,
    children: componentChildren,
    ...componentProps
  }: StyledProps<P>) {
    const { hover, focus, active, ...handlers } =
      useInteraction(componentProps);

    const classes = tw ?? className ?? "";

    const twCallback = useTailwind({
      hover,
      focus,
      active,
      flatten: false,
    });

    const { childStyles, ...styledProps } = useStyledProps({
      tw: twCallback,
      classes,
      componentStyles,
      propsToTransform,
      componentProps,
    });

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

type StyledComponentProps<P> = StyledProps<P> & {
  component: Component<P>;
};

export function StyledComponent<P>({
  component,
  ...options
}: StyledComponentProps<P>) {
  const Component = styled<P>(component);
  return <Component {...(options as P)} />;
}
