/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, CSSProperties, forwardRef, useMemo } from "react";
import { Style } from "../../../transform-css/types";
import { mergeClassNames } from "../stylesheet";
import {
  Styled,
  StyledOptions,
  TransformConfigOption,
} from "../../types/styled";
import { variants, VariantsConfig } from "../../variants";

function isClassPropOptions(
  options: unknown
): options is TransformConfigOption {
  return Boolean(options && typeof options === "object" && "class" in options);
}

function useStyle(classValue?: string, style?: CSSProperties) {
  return useMemo(() => {
    const mergedClassName = classValue
      ? mergeClassNames(classValue)
      : undefined;

    if (mergedClassName && style) {
      return [
        { $$css: true, [mergedClassName]: mergedClassName } as Style,
        style,
      ];
    } else if (mergedClassName) {
      return { $$css: true, [mergedClassName]: mergedClassName } as Style;
    }
    if (style) {
      return style;
    }
  }, [style, classValue]);
}

export const styled: Styled = <
  T,
  C,
  PAdd extends string,
  PRemove extends keyof T & string
>(
  Component: ComponentType<T>,
  classValueOrOptions?: string | StyledOptions<T, C, PAdd, PRemove>,
  maybeOptions?: StyledOptions<T, C, PAdd, PRemove>
) => {
  const { props, defaultProps, ...variantsConfig } =
    typeof classValueOrOptions === "object"
      ? classValueOrOptions
      : maybeOptions ?? ({} as StyledOptions<T, C, PAdd, PRemove>);

  const baseClassValue =
    typeof classValueOrOptions === "string" ? classValueOrOptions : "";

  const classProps: string[] = [];

  if (props) {
    for (const [key, propOptions] of Object.entries(props)) {
      if (isClassPropOptions(propOptions)) {
        classProps.push(key);
      }
    }
  }

  const classGenerator = variants(
    baseClassValue,
    variantsConfig as VariantsConfig<C>
  );

  const Styled = forwardRef<unknown, any>(function (
    { tw, className, ...props },
    ref
  ) {
    const transformClassValue = classProps.map((prop) => props[prop]);

    const classValue = classGenerator({
      ...props,
      className: [transformClassValue, tw ?? className],
    });

    const style = useStyle(classValue, props.style);

    return <Component ref={ref} {...props} style={style} />;
  });

  if (typeof Component !== "string") {
    Styled.displayName = `NativeWind.${
      Component.displayName || Component.name || "NoName"
    }`;
  }

  Styled.defaultProps = defaultProps;

  return Styled;
};

export const StyledComponent = forwardRef(function StyledComponent(
  { component: Component, className, tw, style: inlineStyle, ...props }: any,
  ref
) {
  const style = useStyle(tw ?? className, props.style);
  return <Component ref={ref} {...props} style={style} />;
});
