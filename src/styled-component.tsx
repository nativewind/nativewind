import { styled, StyledOptions } from "./styled";
import { Component, StyledProps } from "./utils/styled";

export type StyledComponentProps<P> = StyledProps<P> & {
  component: Component<P>;
  styledOptions?: StyledOptions<P>;
};

export function StyledComponent<P>({
  component,
  styledOptions,
  ...options
}: StyledComponentProps<P>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- I'm too tired to type this
  const Component = styled<P>(component, styledOptions as any);
  return <Component {...(options as P)} />;
}
