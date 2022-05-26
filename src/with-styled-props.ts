import { StyleProp } from "react-native";
import { AtRuleRecord } from "./types/common";
import { UseTailwindCallback } from "./use-tailwind";

export const ChildClassNameSymbol = Symbol("tailwind-child");

export interface WithStyledPropsOptions<S, T extends string> {
  classes: string | undefined;
  styleProp: StyleProp<S>;
  propsToTransform?: T[];
  componentProps: Record<string, unknown>;
  tw: UseTailwindCallback<S>;
  spreadProps?: T[];
  cssProps?: T[];
  preview: boolean;
}

export type WithStyledProps<S, T extends string> = Record<T, unknown> & {
  childStyles?: AtRuleRecord[];
  style: StyleProp<S>;
};

export function withStyledProps<S, T extends string>({
  tw,
  classes,
  propsToTransform,
  styleProp,
  componentProps,
  spreadProps = [],
  cssProps = [],
  preview,
}: WithStyledPropsOptions<S, T>): WithStyledProps<S, T> {
  const mainStyles = tw(classes, { flatten: false });

  const styledProps: Partial<Record<T, unknown>> = {};

  for (const prop of cssProps) {
    const value = componentProps[prop];

    if (typeof value === "string") {
      if (preview) {
        styledProps[prop] = undefined;
        (mainStyles as unknown as Record<string, unknown>)[prop] = (
          tw(value, {
            flatten: false,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          }) as any
        ).tailwindClassName;
      } else {
        const entries = Object.entries(tw(value, { flatten: true }));
        if (entries.length > 0) {
          styledProps[prop] = undefined;
          for (const [key, value] of entries) {
            styledProps[key as T] = value;
          }
        }
      }
    }
  }

  for (const prop of spreadProps) {
    const value = componentProps[prop];

    if (typeof value === "string") {
      const entries = Object.entries(tw(value, { flatten: true }));
      if (entries.length > 0) {
        styledProps[prop] = undefined;
        for (const [key, value] of entries) {
          styledProps[key as T] = value;
        }
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
    : Array.isArray(mainStyles) && mainStyles.length > 0
    ? mainStyles
    : "$$css" in mainStyles
    ? mainStyles
    : undefined;

  return {
    childStyles: mainStyles[ChildClassNameSymbol],
    style,
    ...componentProps,
    ...styledProps,
  };
}
