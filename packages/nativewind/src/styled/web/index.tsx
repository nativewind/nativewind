/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ForwardedRef, forwardRef, useMemo } from "react";
import { StyleProp } from "react-native";
import { Style } from "../../transform-css/types";
import type { PropsWithClassName, StyledOptions } from "../index";

export function styled(
  Component: ComponentType<{
    style: StyleProp<Style>;
    ref: ForwardedRef<unknown>;
  }>,
  styledBaseClassNameOrOptions?: string | StyledOptions<unknown, never>,
  maybeOptions: StyledOptions<unknown, never> = {}
) {
  const { classProps } =
    typeof styledBaseClassNameOrOptions === "object"
      ? styledBaseClassNameOrOptions
      : maybeOptions;

  const baseClassName =
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : maybeOptions?.baseClassName;

  return forwardRef(
    (
      {
        tw,
        className,
        style: inlineStyle,
        ...props
      }: PropsWithClassName<{ style: Style }>,
      ref
    ) => {
      let actualClassName = tw ?? className;

      if (classProps) actualClassName = `${classProps} ${actualClassName}`;
      if (baseClassName)
        actualClassName = `${baseClassName} ${actualClassName}`;

      const style = useMemo(() => {
        return actualClassName
          ? [{ $$css: true, tailwind: actualClassName } as Style, inlineStyle]
          : inlineStyle;
      }, [inlineStyle, actualClassName]);

      return <Component ref={ref} {...props} style={style} />;
    }
  );
}

export const StyledComponent = forwardRef(
  ({ component, ...options }: any, ref) => {
    const Component = useMemo(() => styled(component), [component]);
    return <Component {...options} ref={ref} />;
  }
);
