/* eslint-disable @typescript-eslint/no-explicit-any */
import { StyleProp } from "react-native";
import { usePlatform } from "./context/platform";
import { AtRuleRecord } from "./types/common";
import { UseTailwindCallback } from "./use-tailwind";

export const ChildClassNameSymbol = Symbol("tailwind-child");

export interface WithStyledPropsOptions<S, T extends string> {
  classes: string | undefined;
  styleProp: StyleProp<S>;
  propsToTransform?: false | T[];
  componentProps: Record<string, unknown>;
  tw: UseTailwindCallback<S>;
  svg?: boolean;
}

export type WithStyledProps<S, T extends string> = Record<T, StyleProp<S>> & {
  childStyles?: AtRuleRecord[];
  style: StyleProp<S>;
};

export function withStyledProps<S, T extends string>({
  tw,
  classes,
  propsToTransform,
  styleProp,
  componentProps,
  svg = true,
}: WithStyledPropsOptions<S, T>): WithStyledProps<S, T> {
  const { preview } = usePlatform();
  const mainStyles = tw(classes, { flatten: false });

  const styledProps: Partial<Record<T, StyleProp<S>>> = {};

  /**
   * There are 3 special SVG props: fill, stroke & strokeWidth
   *
   * Unlike other props, their value is extracted from the style object and passed to the prop
   *
   * Native: <SVG fill="fill-white" />  --->  <SVG fill="#fff" />
   * CSS: <SVG fill="fill-white" />  --->  <SVG className="fill-white" />
   */
  if (svg) {
    const fillProp = componentProps["fill"];
    if (typeof fillProp === "string" && fillProp.includes("fill-")) {
      if (preview) {
        mainStyles.push({ $$css: true, fillProp } as any);
      } else {
        const { fill } = tw(fillProp) as any;
        styledProps["fill" as T] = fill;
      }
    }

    const strokeProp = componentProps["stroke"];
    if (typeof strokeProp === "string" && strokeProp.includes("stroke-")) {
      if (preview) {
        mainStyles.push({ $$css: true, strokeProp } as any);
      } else {
        const { stroke, strokeWidth } = tw(strokeProp) as any;
        if (stroke) styledProps["stroke" as T] = stroke;
        if (strokeWidth) styledProps["strokeWidth" as T] = strokeWidth;
      }
    }
  }

  if (propsToTransform) {
    for (const prop of propsToTransform) {
      const value = componentProps[prop];

      if (typeof value === "string") {
        styledProps[prop] = tw(value, { flatten: false });
      }
    }
  }

  const style = styleProp
    ? [mainStyles, styleProp]
    : mainStyles.length > 0
    ? mainStyles
    : undefined;

  return {
    childStyles: mainStyles[ChildClassNameSymbol],
    style,
    ...styledProps,
  };
}
