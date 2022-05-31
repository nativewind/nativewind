import * as React from "react";
import { styled } from "./styled";
import { StyledProps } from "./utils/styled";

export type StyledComponentProps<P> = StyledProps<P> & {
  component: React.ComponentType<P>;
};

/**
 * This might cause issues in the future, but we provide an override of forwardRef
 * to provide better typing of our components
 */
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/ban-types
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): React.ForwardRefExoticComponent<
    React.PropsWithoutRef<P> & React.RefAttributes<T>
  >;
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
