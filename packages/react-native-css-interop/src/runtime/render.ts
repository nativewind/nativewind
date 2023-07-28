import type { ComponentType } from "react";
import { globalStyles } from "./shared/globals";
import {
  BasicInteropFunction,
  JSXFunction,
  PropMapperFunction,
} from "../types";

export const interopMapping = new WeakMap<
  ComponentType<any>,
  BasicInteropFunction
>();

export const propMapping = new WeakMap<
  ComponentType<any>,
  PropMapperFunction
>();

export function render(
  jsx: JSXFunction,
  type: any,
  props: Record<string | number, unknown>,
  key?: string,
  propMapper = propMapping.get(type),
  cssInterop = interopMapping.get(type),
) {
  if (__DEV__ && "react-native-css-interop-jsx-pragma-check" in type) {
    return true;
  }

  if (propMapper) {
    props = propMapper(props);
  }

  return cssInterop ? cssInterop(jsx, type, props, key) : jsx(type, props, key);
}

export function createPropMapper(
  mapping: Record<string | number, string | undefined | true>,
) {
  const entries = Object.entries(mapping);

  return ({ ...props }: Record<string | number, unknown>) => {
    for (const [alias, propOrBoolean] of entries) {
      const className = props[alias];

      if (!propOrBoolean || !className || typeof className !== "string") {
        continue;
      }

      const targetProp = propOrBoolean === true ? alias : propOrBoolean;

      // Split className string into an array of class names, then map each class
      // name to its corresponding global style object, if one exists.
      const newStyles = className
        .split(/\s+/)
        .map((s) => globalStyles.get(s))
        .filter(Boolean);

      if (newStyles.length > 0) {
        const existingStyles = props[targetProp];

        let newProp = Array.isArray(existingStyles)
          ? [...newStyles, ...existingStyles]
          : existingStyles
          ? [...newStyles, existingStyles]
          : newStyles;

        // If there is only one style in the resulting array, replace the array with that single style.
        if (Array.isArray(newProp) && newProp.length <= 1) {
          newProp = newProp[0];
        }

        props[targetProp] = newProp;
        if (targetProp !== alias) {
          delete props[alias];
        }
      }
    }

    return props;
  };
}
