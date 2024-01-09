import {
  useContext,
  useRef,
  forwardRef,
  useEffect,
  createElement,
  useState,
} from "react";
import { CssInterop, JSXFunction } from "../types";
import { getNormalizeConfig } from "./config";
import { ComponentState, interopContext } from "./native/component-state";
import { opaqueStyles, styleSignals } from "./native/globals";

export const interopComponents = new Map<
  object | string,
  Parameters<JSXFunction>[0]
>();

export const cssInterop: CssInterop = (baseComponent, mapping): any => {
  const config = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function CssInteropComponent(
    props: Record<string, any>,
    ref: any,
  ) {
    if (props.___skipInterop) {
      return createElement(baseComponent, props, props.children);
    }

    const parent = useContext(interopContext);
    const forceUpdate = useState({});

    const componentRef = useRef<ComponentState>();
    if (!componentRef.current) {
      componentRef.current = new ComponentState(
        baseComponent,
        parent,
        () => forceUpdate[1](() => ({})),
        config,
        props.testID,
      );
    }

    useEffect(
      () => () => {
        componentRef.current?.cleanup();
      },
      [],
    );

    return componentRef.current.render(parent, props, ref);
  });
  interopComponent.displayName = `CssInterop.${baseComponent.displayName}`;
  interopComponents.set(baseComponent, interopComponent);
  return interopComponent;
};

export const remapProps: CssInterop = (component: any, mapping): any => {
  const { config } = getNormalizeConfig(mapping);

  const interopComponent = forwardRef(function RemapPropsComponent(
    { ...props }: Record<string, any>,
    ref: any,
  ) {
    for (const entry of config) {
      const key = entry[0];
      const sourceProp = entry[1];
      let rawStyles = [];

      const source = props?.[sourceProp];

      if (typeof source !== "string") continue;
      delete props[sourceProp];

      for (const className of source.split(/\s+/)) {
        const signal = styleSignals.get(className);

        if (signal !== undefined) {
          const style = {};
          opaqueStyles.set(style, signal.get());
          rawStyles.push(style);
        }
      }

      if (rawStyles.length !== 0) {
        const existingStyle = props[key];

        if (Array.isArray(existingStyle)) {
          rawStyles.push(...existingStyle);
        } else if (existingStyle) {
          rawStyles.push(existingStyle);
        }

        (props as any)[key] = rawStyles.length === 1 ? rawStyles[0] : rawStyles;
      }
    }

    if (props.___ref) {
      props.ref = props.___ref;
      delete props.___ref;
    }

    return createElement(component as any, props, props.children);
  });

  interopComponents.set(component as any, interopComponent);

  return interopComponent;
};
