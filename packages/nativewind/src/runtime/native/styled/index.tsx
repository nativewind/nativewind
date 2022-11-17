import { ComponentType, forwardRef } from "react";
import {
  AnyStyledOptions,
  Styled,
  StyledComponentType,
} from "../../types/styled";
import { variants } from "../../variants";
import useStyled from "./use-styled";

export const styled: Styled = (
  component: ComponentType,
  classValueOrOptions?: string | AnyStyledOptions,
  maybeOptions?: AnyStyledOptions
) => {
  const {
    props: transformConfig,
    defaultProps,
    ...cvaOptions
  } = typeof classValueOrOptions === "object"
    ? classValueOrOptions
    : maybeOptions ?? ({} as AnyStyledOptions);

  const baseClassValue =
    typeof classValueOrOptions === "string" ? classValueOrOptions : "";

  const classGenerator = variants(baseClassValue, cvaOptions);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const StyledComponent = forwardRef(useStyled) as StyledComponentType;
