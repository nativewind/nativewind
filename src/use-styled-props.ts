import { StyleProp } from "react-native";
import { UseTailwindCallback } from "./use-tailwind";
import { ChildClassNameSymbol } from "./utils/child-styles";

export interface UseStyledPropsOptions {
  tw: UseTailwindCallback<any>;
  classes: string | undefined;
  componentStyles: StyleProp<any>;
  propsToTransform?: boolean | string[];
  componentProps: Record<string, unknown>;
}

export function useStyledProps({
  tw,
  classes,
  componentStyles,
  propsToTransform,
  componentProps,
}: UseStyledPropsOptions) {
  const mainStyles = tw(classes);

  const style = componentStyles ? [mainStyles, componentStyles] : mainStyles;

  const styledProps: Record<string, unknown> = {};

  if (propsToTransform) {
    if (propsToTransform === true) {
      propsToTransform = Object.keys(componentProps);
    }

    for (const prop of propsToTransform) {
      const value = componentProps[prop];

      if (typeof value === "string") {
        styledProps[prop] = tw(value);
      }
    }
  }

  console.log(styledProps);

  return {
    childStyles: mainStyles[ChildClassNameSymbol],
    style,
    ...styledProps,
  };
}
