import { StyleProp, StyleSheet } from "react-native";
import { StylesArray } from "../style-sheet";
import { useTailwind } from "./use-tailwind";

export interface WithStyledPropsOptions<T extends string> {
  preprocessed: boolean;
  propsToTransform?: T[];
  componentProps: Record<string, unknown>;
  spreadProps?: T[];
  classProps?: T[];
}

export function withStyledProps<S, T extends string>({
  propsToTransform = [],
  componentProps,
  classProps = [],
  preprocessed,
}: WithStyledPropsOptions<T>) {
  const styledProps: Partial<Record<T, unknown>> = {};

  const additionalStyles: StylesArray = [];

  for (const prop of classProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stylesArray = useTailwind<S>(componentProps[prop] as any);

    if (stylesArray.length === 0) {
      continue;
    }

    styledProps[prop] = undefined;

    if (preprocessed) {
      additionalStyles.push(...stylesArray);
    } else {
      for (const [key, value] of Object.entries(
        StyleSheet.flatten(stylesArray as StyleProp<T>)
      )) {
        styledProps[key as T] = value;
      }
    }
  }

  for (const prop of propsToTransform) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stylesArray = useTailwind<S>(componentProps[prop] as any);

    if (stylesArray.length === 0) {
      continue;
    }

    styledProps[prop] = StyleSheet.flatten(stylesArray as StyleProp<T>);
  }

  return {
    ...componentProps,
    ...styledProps,
    additionalStyles,
  };
}
