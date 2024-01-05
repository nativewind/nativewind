import {
  Component,
  PureComponent,
  useContext,
  useState,
  useRef,
  forwardRef,
  createElement,
} from "react";
import {
  CssInterop,
  JSXFunction,
  JSXFunctionProps,
  JSXFunctionRest,
  JSXFunctionType,
} from "../../types";
import { getNormalizeConfig } from "../config";
import { getStyleStateFn } from "../native/component-signal";

// https://github.com/mobxjs/mobx/blob/55260aa158919033e862d219e60eea601a05ac61/packages/mobx-react-lite/src/observer.ts#L8C1-L12C87
const hasSymbol = typeof Symbol === "function" && Symbol.for;
const ReactForwardRefSymbol = hasSymbol
  ? Symbol.for("react.forward_ref")
  : typeof forwardRef === "function" &&
    forwardRef((props: any) => null)["$$typeof"];

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

export function interopJSX(
  jsx: JSXFunction,
  type: JSXFunctionType,
  props: JSXFunctionProps,
  ...rest: JSXFunctionRest
) {
  if (props.__pressable) {
    let { __pressable, ...newProps } = props;
    return jsx.call(jsx, type, newProps, ...rest);
  }

  return jsx.call(jsx, interopComponents.get(type) ?? type, props, ...rest);
}

export const cssInterop: CssInterop = (baseComponent: any, mapping) => {
  const config = getNormalizeConfig(mapping);

  let interopComponent: any;

  if (
    (Object.prototype.isPrototypeOf.call(Component, baseComponent) ||
      Object.prototype.isPrototypeOf.call(PureComponent, baseComponent)) &&
    baseComponent["$$typeof"] !== ReactForwardRefSymbol
  ) {
    // TODO: We don't unwrap class components just yet, so add a wrapper layer
  } else {
    let useForwardRef = false;
    let render: any = baseComponent;

    if (baseComponent["$$typeof"] === ReactForwardRefSymbol) {
      useForwardRef = true;
      render = baseComponent["render"];
    }

    interopComponent = function CssInteropComponent({ ...props }, ref: any) {
      const parent = useContext({} as any);
      const forceUpdate = useState({});

      const styleStateRef = useRef<ReturnType<typeof getStyleStateFn>>();
      if (!styleStateRef.current) {
        styleStateRef.current = getStyleStateFn(
          parent,
          () => forceUpdate[1](() => ({})),
          config,
        );
      }

      const state = styleStateRef.current(parent, props);

      const type = render.bind({
        baseComponent,
      })(state.props, ref);

      return type;
    };
    interopComponent.displayName = `CssInterop.${baseComponent.displayName}`;

    if (useForwardRef) {
      interopComponent = forwardRef(interopComponent);
    }
  }

  interopComponents.set(baseComponent, interopComponent);

  return interopComponent;
};

// function upgradeComponent(type: any, state: any, ref: any) {
//   console.log(state.props);
//   return createElement(type, { ...state.props, ref });
// }

// TODO
export const remapProps = cssInterop;
