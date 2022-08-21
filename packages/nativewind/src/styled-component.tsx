import React, { ComponentProps, ComponentPropsWithRef } from "react";
import { styled, StyledProps } from "./styled";

export type StyledComponentProps<P> = StyledProps<P> & {
  component: React.ComponentType<P>;
};

export const StyledComponent = React.forwardRef(
  ({ component, ...options }, ref) => {
    const Component = React.useMemo(() => styled(component), [component]);
    return (
      <Component
        {...(options as unknown as ComponentProps<typeof Component>)}
        ref={ref as ComponentPropsWithRef<typeof Component>["ref"]}
      />
    );
  }
) as <T, P>(
  props: StyledComponentProps<P> & React.RefAttributes<T>
) => React.ReactElement | null;
