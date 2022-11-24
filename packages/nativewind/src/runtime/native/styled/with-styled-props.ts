import { useSyncExternalStore } from "use-sync-external-store/shim";
import type { TransformConfigOption } from "../../types/styled";
import { subscribeToStyleSheet, getStyleSet } from "../stylesheet/runtime";
import { ComponentState } from "./use-styled";
import { withConditionals } from "./with-conditionals";

export interface WithStyledPropsOptions {
  props: Record<string, unknown>;
  transformConfig?: Record<string, TransformConfigOption | string | true>;
  componentState: ComponentState;
}

export function withStyledProps({
  transformConfig,
  props,
  componentState,
}: WithStyledPropsOptions) {
  const styledProps: Record<string, unknown> = {};

  if (transformConfig) {
    for (const [propName, propOptions] of Object.entries(transformConfig)) {
      const prop = props[propName];

      if (typeof prop !== "string") continue;

      const { className } = withConditionals(prop, componentState);

      const styles = useSyncExternalStore(
        subscribeToStyleSheet,
        () => getStyleSet(className),
        () => getStyleSet(className)
      );

      if (styles) {
        if (typeof propOptions === "boolean") {
          styledProps[propName] = styles;
        } else if (typeof propOptions === "string") {
          styledProps[propOptions] = styles;
        } else {
          const { name = prop, value } = propOptions;
          styledProps[name] = value ? styles[value] : styles;
        }
      }
    }
  }

  return styledProps;
}
