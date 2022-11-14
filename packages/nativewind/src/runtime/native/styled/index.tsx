/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, forwardRef } from "react";
import { Styled, StyledOptions } from "../../types/styled";
import { variants, VariantsConfig } from "../../variants";
import useStyled from "./use-styled";

export const styled: Styled = <
  T,
  C,
  PAdd extends string,
  PRemove extends keyof T & string
>(
  component: ComponentType<T>,
  classValueOrOptions?: string | StyledOptions<T, C, PAdd, PRemove>,
  maybeOptions?: StyledOptions<T, C, PAdd, PRemove>
) => {
  const {
    props: transformConfig,
    defaultProps,
    ...cvaOptions
  } = typeof classValueOrOptions === "object"
    ? classValueOrOptions
    : maybeOptions ?? ({} as StyledOptions<T, C, PAdd, PRemove>);

  const baseClassValue =
    typeof classValueOrOptions === "string" ? classValueOrOptions : "";

  const classGenerator = variants(
    baseClassValue,
    cvaOptions as VariantsConfig<C>
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
