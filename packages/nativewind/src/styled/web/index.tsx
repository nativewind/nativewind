/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ForwardedRef, forwardRef, useMemo } from "react";
import { StyleProp } from "react-native";
import { cva } from "class-variance-authority";
import { Style } from "../../transform-css/types";
import type { StyledOptions } from "../index";

export function styled(
  component: ComponentType<{
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

  const Styled = forwardRef<unknown, any>(function (
    { className, tw, ...props },
    ref
  ) {
    const generatedClassName = classGenerator({
      class: tw ?? className,
      ...props,
    });

    return (
      <StyledComponent
        ref={ref}
        component={component}
        className={generatedClassName}
        {...props}
      />
    );
  });

  if (typeof component !== "string") {
    Styled.displayName = `NativeWind.${
      component.displayName || component.name || "NoName"
    }`;
  }

  return Styled;
}

export const StyledComponent = forwardRef(function StyledComponent(
  { component: Component, className, style: inlineStyle, ...props }: any,
  ref
) {
  const style = useMemo(() => {
    if (className && inlineStyle) {
      return [{ $$css: true, tailwind: className } as Style, inlineStyle];
    } else if (className) {
      return { $$css: true, tailwind: className } as Style;
    }
    if (inlineStyle) {
      return inlineStyle;
    }
  }, [inlineStyle, className]);

  return <Component ref={ref} {...props} style={style} />;
});
