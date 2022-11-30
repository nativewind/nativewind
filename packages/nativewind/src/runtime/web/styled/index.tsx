import { ComponentType, forwardRef } from "react";
import {
  AnyStyledOptions,
  Styled,
  StyledComponentType,
} from "../../types/styled";
import { variants } from "../../variants";
import { useStyle } from "./use-style";

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
  const extraTransform: Record<string, string> = {};

  if (props) {
    for (const [key, propOptions] of Object.entries(props)) {
      if (
        propOptions &&
        typeof propOptions === "object" &&
        "class" in propOptions
      ) {
        classProps.push(key);
      } else if (typeof propOptions === "string") {
        extraTransform[key] = propOptions;
      } else if (propOptions === true) {
        extraTransform[key] = key;
      }
    }
  }

  const hasExtraProps = props && Object.keys(extraTransform).length > 0;

  const classGenerator = variants(baseClassValue, variantsConfig);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Styled = forwardRef<unknown, any>(function (
    { tw, className, ...props },
    ref
  ) {
    let processedProps = props;
    const transformClassValue: string[] = [];

    if (hasExtraProps || classProps.length > 0) {
      processedProps = {};

      for (const [key, value] of Object.entries(props)) {
        if (extraTransform[key] && typeof value === "string") {
          const newKey =
            key === extraTransform[key] ? key : extraTransform[key];

          processedProps[newKey] = { $$css: true, [value]: value };
        } else if (classProps.includes(key) && typeof value === "string") {
          transformClassValue.push(value);
        } else {
          processedProps[key] = value;
        }
      }
    }

    const style = useStyle(
      classGenerator({
        ...props,
        className: [transformClassValue.join(" "), tw ?? className],
      }),
      props.style
    );

    return <Component ref={ref} {...processedProps} style={style} />;
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
