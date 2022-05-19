import { StyleProp } from "react-native";
import { styled, StyledOptions } from "./styled";
import { Component, StyledProps } from "./utils/styled";

export type StyledComponentProps<
  P extends { style?: StyleProp<T> },
  T
> = StyledProps<P, T> & {
  component: Component<P, T>;
  styledOptions?: StyledOptions<P>;
};

export function StyledComponent<P extends { style?: StyleProp<T> }, T>({
  component,
  styledOptions,
  ...options
}: StyledComponentProps<P, T>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I'm too tired to type this
  const Component = styled<P, T>(component, styledOptions as any);
  return <Component {...(options as P)} />;
}
