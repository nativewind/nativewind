import * as React from "react";
import { styled } from "./styled";
import { StyledProps } from "./utils/styled";

export type StyledComponentProps<P> = StyledProps<P> & {
  component: React.ComponentType<P>;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

function StyledComponentFunction<P>(
  { component, ...options }: StyledComponentProps<P>,
  ref: React.ForwardedRef<unknown>
) {
  const Component = styled(component);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Component {...(options as any)} ref={ref} />;
}

export const StyledComponent = React.forwardRef(StyledComponentFunction);
