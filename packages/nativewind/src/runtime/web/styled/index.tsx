import { ComponentType, forwardRef } from "react";
import {
  AnyStyledOptions,
  Styled,
  StyledComponentType,
  TransformConfigOption,
} from "../../types/styled";
import { variants } from "../../variants";
import { useStyle } from "./use-style";

function isClassPropOptions(
  options: unknown
): options is TransformConfigOption {
  return Boolean(options && typeof options === "object" && "class" in options);
}

export const styled: Styled = (
  Component: ComponentType,
  classValueOrOptions?: string | AnyStyledOptions,
  maybeOptions?: AnyStyledOptions
) => {
  const { props, defaultProps, ...variantsConfig } =
    typeof classValueOrOptions === "object"
      ? classValueOrOptions
      : maybeOptions ?? ({} as AnyStyledOptions);

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

  const classGenerator = variants(baseClassValue, variantsConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const StyledComponent = forwardRef<unknown, any>(
  function StyledComponent(
    { component: Component, className, tw, ...props },
    ref
  ) {
    const style = useStyle(tw ?? className, props.style);
    return <Component ref={ref} {...props} style={style} />;
  }
) as StyledComponentType;
