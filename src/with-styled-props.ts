import { StyleProp } from "react-native";
import { AtRuleRecord } from "./types/common";
import { UseTailwindCallback } from "./use-tailwind";

export const ChildClassNameSymbol = Symbol("twrn-child");

export interface WithStyledPropsOptions<P, T extends string> {
  classes: string | undefined;
  componentStyles: StyleProp<P>;
  propsToTransform?: boolean | T[];
  componentProps: Record<string, unknown>;
  tw: UseTailwindCallback<P>;
}

export type WithStyledProps<P, T extends string> = Record<T, StyleProp<P>> & {
  childStyles?: AtRuleRecord[];
  style: StyleProp<P>;
};

export function withStyledProps<P, T extends string>({
  tw,
  classes,
  componentStyles,
  propsToTransform,
  componentProps,
}: WithStyledPropsOptions<P, T>): WithStyledPropss<P, T> {
  const mainStyles = tw(classes);

  const style = componentStyles
    ? [mainStyles, componentStyles]
    : Array.isArray(mainStyles) && mainStyles.length > 0
    ? mainStyles
    : undefined;

  const styledProps: Partial<Record<T, StyleProp<P>>> = {};

  if (propsToTransform) {
    if (propsToTransform === true) {
      propsToTransform = Object.keys(componentProps) as T[];
    }

    for (const prop of propsToTransform) {
      const value = componentProps[prop];

      if (typeof value === "string") {
        styledProps[prop] = tw(value);
      }
    }
  }

  return {
    childStyles: mainStyles[ChildClassNameSymbol],
    style,
    ...(styledProps as Record<T, StyleProp<P>>),
  };
}
