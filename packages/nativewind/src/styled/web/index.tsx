/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ForwardedRef, forwardRef, useMemo } from "react";
import { StyleProp } from "react-native";
import { cva } from "class-variance-authority";
import { Style } from "../../transform-css/types";
import type { PropsWithClassName, StyledOptions } from "../index";

export function styled(
  Component: ComponentType<{
    style: StyleProp<Style>;
    ref: ForwardedRef<unknown>;
  }>,
  styledBaseClassNameOrOptions?: string | StyledOptions<unknown, never>,
  maybeOptions: StyledOptions<any, any> = {}
) {
  const { classProps, baseClassName, props, ...cvaOptions } =
    typeof styledBaseClassNameOrOptions === "object"
      ? styledBaseClassNameOrOptions
      : maybeOptions;

  const defaultClassName =
    typeof styledBaseClassNameOrOptions === "string"
      ? styledBaseClassNameOrOptions
      : baseClassName;

  const classGenerator = cva(`${classProps} ${defaultClassName} `, cvaOptions);

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
      const generatedClassName = classGenerator({
        class: tw ?? className,
        ...props,
      });

      const style = useMemo(() => {
        return generatedClassName
          ? [
              { $$css: true, tailwind: generatedClassName } as Style,
              inlineStyle,
            ]
          : inlineStyle;
      }, [inlineStyle, generatedClassName]);

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
