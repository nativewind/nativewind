import type { StyledOptions } from ".";
import { NativeWindStyleSheet } from "../style-sheet";
import { ComponentState } from "./use-component-state";

export interface WithStyledPropsOptions<
  T,
  P extends keyof T,
  C extends keyof T
> {
  className: string;
  propsToTransform?: StyledOptions<T, P, C>["props"];
  componentProps: Record<P | C | string, string>;
  componentState: ComponentState;
  classProps?: C[];
}

export function withStyledProps<T, P extends keyof T, C extends keyof T>({
  propsToTransform,
  componentProps,
  componentState,
  classProps,
  className,
}: WithStyledPropsOptions<T, P, C>) {
  const styledProps: Partial<Record<P | C, unknown>> = {};

  const isPreprocessed = NativeWindStyleSheet.isPreprocessed();

  if (classProps) {
    if (isPreprocessed) {
      for (const prop of classProps) {
        styledProps[prop] = undefined;
        className += ` ${componentProps[prop]}`;
      }
    } else {
      for (const prop of classProps) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { styles } = NativeWindStyleSheet.useSync(componentProps[prop], {
          ...componentState,
          flatten: true,
        });

        Object.assign(
          styledProps,
          { [prop]: undefined },
          Array.isArray(styles) ? styles[0] : styles
        );
      }
    }
  }

  if (propsToTransform && !isPreprocessed) {
    for (const [prop, styleKey] of Object.entries(propsToTransform)) {
      const { styles } = NativeWindStyleSheet.useSync(componentProps[prop], {
        ...componentState,
        flatten: styleKey !== true,
      });

      if (typeof styleKey === "boolean") {
        styledProps[prop as P | C] = styles;
      } else {
        const firstStyle = Array.isArray(styles) ? styles[0] : styles;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        styledProps[prop as P | C] = (firstStyle as any)[styleKey as any];
      }
    }
  }

  return { styledProps, className };
}
