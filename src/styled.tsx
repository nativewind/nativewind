import {
  createElement,
  FunctionComponent,
  ComponentClass,
  PropsWithChildren,
  Children,
  cloneElement,
} from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";
import { useTailwind } from "./use-tailwind";
import { ChildClassNameSymbol } from "./utils/child-styles";
import { isFragment } from "react-is";
import { useInteraction } from "./use-interaction";
import { ComponentContext } from "./context";

type StyledProps<P> = PropsWithChildren<
  P & {
    className?: string;
    inheritedClassName?: string;
    nthChild?: number;
    tw?: string;
    style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  }
>;

type Component<P> = string | FunctionComponent<P> | ComponentClass<P>;

export function styled<P>(
  Component: Component<P>
): FunctionComponent<StyledProps<P>> {
  function Styled({
    className,
    tw,
    inheritedClassName,
    nthChild,
    style: styleProperty,
    children: componentChildren,
    ...props
  }: StyledProps<P>) {
    const { hover, focus, active, ...handlers } = useInteraction(props);

    const classes = tw ?? className ?? "";

    const tailwindStyles = useTailwind({
      nthChild,
      hover,
      focus,
      active,
      [ChildClassNameSymbol]: inheritedClassName,
    })(classes);

    const style = styleProperty
      ? [tailwindStyles, styleProperty]
      : tailwindStyles;

    let children = isFragment(componentChildren)
      ? // This probably needs to be recursive
        componentChildren.props.children
      : componentChildren;

    if (tailwindStyles[ChildClassNameSymbol]) {
      children = Children.map(children, (child, index) => {
        return cloneElement(child, {
          nthChild: index,
          inheritedClassName: tailwindStyles[ChildClassNameSymbol],
        });
      });
    }

    const element = createElement(Component, {
      ...props,
      ...handlers,
      style,
      children,
    } as unknown as P);

    return !classes.includes("component")
      ? element
      : createElement<PropsWithChildren<{ value: ComponentContext }>>(
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
