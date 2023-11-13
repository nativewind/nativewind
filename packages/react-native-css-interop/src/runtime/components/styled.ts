import { ComponentType, forwardRef, createElement } from "react";
import type {
  EnableCssInteropOptions,
  InteropFunction,
  ComponentTypeWithMapping,
} from "../../types";
import { defaultCSSInterop } from "../css-interop";
import { cssInterop, render } from "../render";

export function unstable_styled<P extends object, M>(
  component: ComponentType<P>,
  mapping?: EnableCssInteropOptions<P> & M,
  interop: InteropFunction = defaultCSSInterop,
) {
  if (mapping) {
    cssInterop(component, mapping, interop);
  }

  return forwardRef<unknown, any>((props, _ref) => {
    return render<any>(
      (element, { children, ...props }, key) => {
        children = Array.isArray(children) ? children : [children];
        return createElement(element, { key, ...props }, ...children);
      },
      component,
      props as any,
      props.key,
    );
  }) as unknown as ComponentTypeWithMapping<P, M>;
}
