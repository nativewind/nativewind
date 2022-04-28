import { createElement, FunctionComponent, ComponentClass } from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTailwind } from "./use-tailwind";

const isStyled = Symbol("styled");

type StyledProps<P> = P & {
  className?: string;
  tw?: string;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};

type Component<P> = string | FunctionComponent<P> | ComponentClass<P>;

export function styled<P>(
  Component: Component<P>
): FunctionComponent<StyledProps<P>> {
  function Styled({
    className,
    tw,
    style: styleProperty,
    ...props
  }: StyledProps<P>) {
    const tailwindStyleIds = useTailwind(tw ?? className);

    const style = styleProperty
      ? [tailwindStyleIds, styleProperty]
      : tailwindStyleIds;

    return createElement(Component, { ...props, style } as unknown as P);
  }

  if (typeof Component !== "string") {
    Styled.displayName = `TailwindCssReactNative.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  Styled[isStyled] = true;

  return Styled;
}

type StyledComponentProps<P> = StyledProps<P> & {
  component: Component<P> & {
    [isStyled]?: boolean;
  };
};

export function StyledComponent<P>({
  component,
  ...options
}: StyledComponentProps<P>) {
  if (component[isStyled]) {
    return component;
  }

  return styled<P>(component)(options as P);
}
StyledComponent[isStyled] = true;
