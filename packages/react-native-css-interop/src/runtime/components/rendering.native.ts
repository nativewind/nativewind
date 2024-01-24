import {
  ComponentClass,
  ComponentType,
  FunctionComponent,
  ReactNode,
  createElement,
  forwardRef,
} from "react";
import type {
  CssInterop,
  EnableCssInteropOptions,
  NativeStyleToProp,
  NormalizedOptions,
} from "../../types";
import { defaultCSSInterop } from "../native/interop";
import { interopGlobal } from "../signals";
import { opaqueStyles, styleSignals } from "../native/globals";

export type InteropComponent = {
  type: ComponentType<any>;
  check: (props: Record<string, any> | null) => boolean;
  createElement: (
    props: Record<string, any> | null,
    ...children: ReactNode[]
  ) => ReturnType<typeof createElement>;
};

export const interopComponents = new Map<object | string, InteropComponent>();

export function render(jsx: any, type: any, props: any, ...args: any) {
  const interop = interopComponents.get(type);
  if (interop?.check(props)) {
    if (props.ref) {
      props.___ref = props.ref;
      delete props.ref;
    }
    return jsx(interop.type, props, ...args);
  } else {
    return jsx(type, props, ...args);
  }
}

export const cssInterop: CssInterop = (component, mapping) => {
  const config = getNormalizeConfig(mapping);

  const CssInteropComponent = forwardRef<any, any>(function CssInteropComponent(
    { children, ___pressable, ___ref, ...props },
    ref,
  ) {
    if (___ref || ref) {
      props.ref = ___ref || ref;
    }

    if (___pressable) {
      return createElement(component, props, children);
    } else {
      interopGlobal.isInComponent = true;
      interopGlobal.current = null;
      const element = defaultCSSInterop(component, config, props, children);
      const originalType = element.props;
      /**
       * We can't update another element while rendering, so we need to delay the update.
       * Before React can process the element, it must check its props.
       * So by 'hooking' into it, we can use this as our delaying mechanism
       */
      return Object.create(element, {
        props: {
          get() {
            interopGlobal.isInComponent = false;
            interopGlobal.current = null;
            if (interopGlobal.delayedEvents.size) {
              for (const sub of interopGlobal.delayedEvents) {
                sub();
              }
              interopGlobal.delayedEvents.clear();
            }
            return originalType;
          },
        },
      });
    }
  });

  if (process.env.NODE_ENV === "development") {
    if (typeof component === "string") {
      CssInteropComponent.displayName = `CSSInterop.${component}`;
    } else {
      CssInteropComponent.displayName = `CSSInterop.${
        component.displayName ?? component.name ?? "unknown"
      }`;
    }
  }

  const checkArray = (props: any[]) =>
    props.some((prop): boolean => {
      return Array.isArray(prop) ? checkArray(prop) : opaqueStyles.has(prop);
    });

  const interopComponent: InteropComponent = {
    type: CssInteropComponent,
    createElement(props, ...children) {
      if (props && props.children) {
        children = props.children;
      }
      return defaultCSSInterop(component, config, props, ...children);
    },
    check(props: Record<string, unknown> | null) {
      if (props === null) return false;

      for (const [targetProp, source, nativeStyleToProp] of config.config) {
        if (nativeStyleToProp) return true;

        if (typeof props[source] === "string") {
          return true;
        }

        const target: any = props[targetProp];

        if (Array.isArray(target)) {
          if (checkArray(target)) {
            return true;
          }
        } else if (opaqueStyles.has(target)) {
          return true;
        }
      }

      return false;
    },
  };

  interopComponents.set(component, interopComponent);
  return component;
};

export const remapProps: CssInterop = (component, mapping) => {
  const { config } = getNormalizeConfig(mapping);

  let render: any = ({ ...props }: Record<string, any>) => {
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
  };
  const interopComponent: InteropComponent = {
    type: render,
    check: () => true,
    createElement(props, ...children) {
      return createElement(interopComponent.type, props, ...children);
    },
  };

  interopComponents.set(component as any, interopComponent);

  return component;
};

export function createElementAndCheckCssInterop(
  type: string | FunctionComponent | ComponentClass,
  props: Record<string, any>,
  ...children: ReactNode[]
) {
  if (!type) return createElement(type, props, ...children);

  const interop = interopComponents.get(type as object);

  return !interop || !interop.check(props)
    ? createElement(type, props, ...children)
    : interop.createElement(props, ...children);
}

function getNormalizeConfig(
  mapping: EnableCssInteropOptions<any>,
): NormalizedOptions {
  const config = new Map<
    string,
    [string, NativeStyleToProp<any> | undefined]
  >();
  const dependencies = new Set<string>();
  const sources = new Set<string>();

  for (const [key, options] of Object.entries(mapping) as Array<
    [string, EnableCssInteropOptions<any>[string]]
  >) {
    let target: string | undefined;
    let nativeStyleToProp: NativeStyleToProp<any> | undefined;

    if (!options) continue;

    if (typeof options === "boolean") {
      target = key;
    } else if (typeof options === "string") {
      target = options;
    } else if (typeof options.target === "boolean") {
      target = key;
      nativeStyleToProp = options.nativeStyleToProp;
    } else if (typeof options.target === "string") {
      target = options.target;
      nativeStyleToProp = options.nativeStyleToProp;
    } else {
      throw new Error(
        `Unknown cssInterop target from config: ${JSON.stringify(config)}`,
      );
    }

    config.set(target, [key, nativeStyleToProp]);
    dependencies.add(target);
    dependencies.add(key);
    sources.add(key);
  }

  return {
    dependencies: Array.from(dependencies),
    sources: Array.from(sources),
    config: Array.from(config.entries()).map(
      ([key, [source, nativeStyleToProp]]) => [key, source, nativeStyleToProp],
    ),
  };
}

try {
  const { Svg } = require("react-native-svg");
  cssInterop(Svg, { className: "style" });
} catch {}
try {
  const { SafeAreaView } = require("react-native-safe-area-context");
  cssInterop(SafeAreaView, { className: "style" });
} catch {}
