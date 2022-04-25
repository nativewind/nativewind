import { createElement } from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTailwind } from "./use-tailwind";

type StyledProps<P> = P & {
  className?: string;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};

type Component<P> =
  | string
  | React.FunctionComponent<P>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | React.ComponentClass<P, any>;

const isStyled = Symbol("styled");

export function styled<P>(Component: Component<P>) {
  function Styled({ className, style: styleProp, ...props }: StyledProps<P>) {
    const tailwindStyleIds = useTailwind(className);

    const style = styleProp ? [tailwindStyleIds, styleProp] : tailwindStyleIds;

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
