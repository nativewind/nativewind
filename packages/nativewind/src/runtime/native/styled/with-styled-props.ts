import { useSyncExternalStore } from "use-sync-external-store/shim";
import type { ComponentState } from ".";
import { StyledPropOptions } from "../../../styled";
import { subscribeToStyleSheet, getStyleSet } from "../stylesheet/runtime";
import { withConditionals } from "./with-conditionals";

export interface WithStyledPropsOptions {
  componentProps: Record<string, unknown>;
  propsToTransform?: Record<string, StyledPropOptions | string | true>;
  componentState: ComponentState;
}

export function withStyledProps({
  propsToTransform,
  componentProps,
  componentState,
}: WithStyledPropsOptions) {
  const styledProps: Record<string, unknown> = {};

  if (propsToTransform) {
    for (const [propName, propOptions] of Object.entries(propsToTransform)) {
      const prop = componentProps[propName];

      if (typeof prop !== "string") continue;

      const { className: actualClassName } = withConditionals(
        prop,
        componentState
      );

      const styles = useSyncExternalStore(
        subscribeToStyleSheet,
        () => getStyleSet(actualClassName),
        () => getStyleSet(actualClassName)
      );

      if (typeof propOptions === "boolean") {
        styledProps[prop] = styles;
      } else if (typeof propOptions === "string") {
        styledProps[propOptions] = styles;
      } else {
        const { name = prop, value } = propOptions;
        styledProps[name] = value ? styles[value] : styles;
      }
    }
  }

  return styledProps;
}
