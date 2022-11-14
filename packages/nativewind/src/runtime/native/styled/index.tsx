/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, forwardRef } from "react";
import { Styled, StyledOptions } from "../../types/styled";
import { ConfigSchema, variants, VariantsConfig } from "../../variants";
import useStyled from "./use-styled";

export const styled: Styled = <T, TVariants extends ConfigSchema>(
  component: ComponentType<T>,
  classValueOrOptions?: string | StyledOptions<T, TVariants>,
  maybeOptions?: StyledOptions<T, TVariants>
) => {
  const {
    props: transformConfig,
    defaultProps,
    ...cvaOptions
  } = typeof classValueOrOptions === "object"
    ? classValueOrOptions
    : maybeOptions ?? ({} as StyledOptions<T, TVariants>);

  const baseClassValue =
    typeof classValueOrOptions === "string" ? classValueOrOptions : "";

  const classGenerator = variants(
    baseClassValue,
    cvaOptions as VariantsConfig<TVariants>
  );

  const Styled = forwardRef<unknown, any>(
    ({ tw, className, ...props }, ref) => {
      const classValue = classGenerator({
        ...props,
        className: [tw ?? className],
      });

      return useStyled(
        {
          ...props,
          component,
          transformConfig,
          className: classValue,
        },
        ref
      );
    }
  );

  if (typeof component !== "string") {
    Styled.displayName = `NativeWind.${
      component.displayName || component.name || "NoName"
    }`;
  }

  Styled.defaultProps = defaultProps;

  return Styled;
};

export const StyledComponent = forwardRef(useStyled);
