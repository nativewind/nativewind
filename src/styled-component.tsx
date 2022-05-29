import * as React from "react";
import { styled } from "./styled";
import { StyledProps } from "./utils/styled";

export type StyledComponentProps<P> = StyledProps<P> & {
  component: React.ComponentType<P>;
};

export function StyledComponent<P>({
  component,
  ...options
}: StyledComponentProps<P>) {
  const Component = styled<P>(component);
  return <Component {...(options as P)} />;
}
