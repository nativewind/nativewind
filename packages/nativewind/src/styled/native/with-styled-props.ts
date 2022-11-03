import { useSyncExternalStore } from "use-sync-external-store/shim";
import {
  getStyleSet,
  subscribeToStyleSheet,
} from "../../style-sheet/native/runtime";
import { withConditionals } from "./with-conditionals";
import { ComponentState } from "./use-component-state";

export interface WithStyledPropsOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentProps: Record<string, any>;
  propsToTransform?: Record<string, unknown>;
  componentState: ComponentState;
  classProps?: string[];
}

export function withStyledProps({
  propsToTransform,
  componentProps,
  componentState,
  classProps,
}: WithStyledPropsOptions) {
  const styledProps: Record<string, unknown> = {};

  if (classProps) {
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

  if (propsToTransform) {
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
        styledProps[prop] = styles;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        styledProps[prop] = (styles as any)[styleKey as any];
      }
    }
  }

  return styledProps;
}
