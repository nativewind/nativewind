import { createElement, FunctionComponent, ComponentClass } from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTailwind } from "./use-tailwind";

type StyledProps<P> = P & {
  className?: string;
  tw?: string;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};

type Component<P> =
  | string
  | FunctionComponent<P>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ComponentClass<P, any>;

const isStyled = Symbol("styled");

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

export function StyledComponent<P>({
  component,
  ...options
}: StyledProps<P> & { component: Component<P> }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((component as any)[isStyled]) {
    return component;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return styled<P>(component)(options as any);
}
StyledComponent[isStyled] = true;
