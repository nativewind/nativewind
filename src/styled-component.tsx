import React from "react";
import { styled } from "./styled";
import { StyledProps } from "./utils/styled";

export type StyledComponentProps<P> = StyledProps<P> & {
  component: React.ComponentType<P>;
};

export const StyledComponent = React.forwardRef(
  ({ component, ...options }, ref) => {
    const Component = React.useMemo(() => styled(component), [component]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <Component {...(options as any)} ref={ref as any} />;
  }
) as <T, P>(
  props: StyledComponentProps<P> & React.RefAttributes<T>
) => React.ReactElement | null;
