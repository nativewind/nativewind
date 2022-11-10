/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, ForwardedRef, forwardRef, useMemo } from "react";
import { StyleProp } from "react-native";
import { cva } from "class-variance-authority";

import { Style } from "../../transform-css/types";
import type { StyledOptions } from "../index";
import { mergeClassNames } from "../../style-sheet";

export function styled(
  Component: ComponentType<{
    style: StyleProp<Style>;
    ref: ForwardedRef<unknown>;
  }>,
  styledBaseClassNameOrOptions?:
    | string
    | StyledOptions<Record<string, unknown>, any, string>,
  maybeOptions: StyledOptions<Record<string, unknown>, any, string> = {}
) {
  const {
    class: baseClassName,
    props,
    ...cvaOptions
  } = typeof styledBaseClassNameOrOptions === "object"
    ? styledBaseClassNameOrOptions
    : maybeOptions;

  const classProps: string[] = [];

  if (props) {
    for (const [key, propOptions] of Object.entries(props)) {
      if (propOptions && typeof propOptions === "object" && propOptions.class) {
        classProps.push(key);
      }
    }
  }

  const classGenerator = cva(
    [
      typeof styledBaseClassNameOrOptions === "string"
        ? styledBaseClassNameOrOptions
        : baseClassName,
    ],
    cvaOptions
  );

  const Styled = forwardRef<unknown, any>(function (
    { className, tw, ...props },
    ref
  ) {
    const classPropsClassName = classProps.map((prop) => props[prop]).join(" ");

    const generatedClassName = classGenerator({
      class: [classPropsClassName, tw ?? className],
      ...props,
    });

    if (!generatedClassName) {
      return <Component ref={ref} {...props} />;
    }

    return (
      <StyledComponent
        ref={ref}
        component={Component}
        className={generatedClassName}
        {...props}
      />
    );
  });

  if (typeof Component !== "string") {
    Styled.displayName = `NativeWind.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  return Styled;
}

export const StyledComponent = forwardRef(function StyledComponent(
  { component: Component, className, style: inlineStyle, ...props }: any,
  ref
) {
  const style = useMemo(() => {
    const mergedClassName = className ? mergeClassNames(className) : undefined;

    if (mergedClassName && inlineStyle) {
      return [
        { $$css: true, [mergedClassName]: mergedClassName } as Style,
        inlineStyle,
      ];
    } else if (mergedClassName) {
      return { $$css: true, [mergedClassName]: mergedClassName } as Style;
    }
    if (inlineStyle) {
      return inlineStyle;
    }
  }, [inlineStyle, className]);

  return <Component ref={ref} {...props} style={style} />;
});
