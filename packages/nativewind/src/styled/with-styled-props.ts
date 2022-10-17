import { useSyncExternalStore } from "use-sync-external-store/shim";
import type { StyledOptions } from ".";
import { getStyleSet, subscribeToStyleSheet } from "../style-sheet/runtime";
import { withConditionals } from "./conditionals";
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

  const isPreprocessed = false; // NativeWindStyleSheet.isPreprocessed();

  if (classProps) {
    if (isPreprocessed) {
      for (const prop of classProps) {
        styledProps[prop] = undefined;
        className += ` ${componentProps[prop]}`;
      }
    } else {
      for (const prop of classProps) {
        const { className: actualClassName } = withConditionals(
          componentProps[prop],
          { ...componentState }
        );

        const styles = useSyncExternalStore(
          subscribeToStyleSheet,
          () => getStyleSet(actualClassName),
          () => getStyleSet(actualClassName)
        );

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
      const { className: actualClassName } = withConditionals(
        componentProps[prop],
        { ...componentState }
      );

      const styles = useSyncExternalStore(
        subscribeToStyleSheet,
        () => getStyleSet(actualClassName),
        () => getStyleSet(actualClassName)
      );

      if (typeof styleKey === "boolean") {
        styledProps[prop as P | C] = styles;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        styledProps[prop as P | C] = (styles as any)[styleKey as any];
      }
    }
  }

  return { styledProps, className };
}
