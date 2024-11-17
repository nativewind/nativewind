import { forwardRef } from "react";

import { CssInterop } from "../../types";
import { interopComponents } from "../native/api";
import { getComponentType } from "../native/unwrap-components";
import { getUseInteropOptions, useInterop } from "./useInterop";

/**
 * Generates a new Higher-Order component the wraps the base component and applies the styles.
 * This is added to the `interopComponents` map so that it can be used in the `wrapJSX` function
 * @param baseComponent
 * @param mapping
 */
export const styled: CssInterop = (baseComponent, mapping) => {
  const { configs, initialActions } = getUseInteropOptions(mapping);

  let component: any;
  const type = getComponentType(baseComponent);

  if (type === "function") {
    component = (props: Record<string, any>) => {
      return useInterop(baseComponent, configs, initialActions, props);
    };
  } else {
    component = forwardRef((props, ref) => {
      return useInterop(baseComponent, configs, initialActions, props, ref);
    });
  }

  const name = baseComponent.displayName ?? baseComponent.name ?? "unknown";
  component.displayName = `CssInterop.${name}`;
  interopComponents.set(baseComponent, component);
  return component;
};
