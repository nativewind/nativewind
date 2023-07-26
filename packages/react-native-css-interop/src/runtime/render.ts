import type { ComponentType } from "react";
import { globalStyles } from "./shared/globals";

export type JSXFunction = (
  type: any,
  props: Record<string | number, unknown>,
  key?: string,
) => any;

export type InteropFunction = (
  jsx: JSXFunction,
  type: any,
  props: Record<string | number, unknown>,
  key?: string,
) => any;

export const interopMapping = new WeakMap<
  ComponentType<any>,
  InteropFunction
>();

export type PropRemaperFunction = (
  props: Record<string | number, unknown>,
) => Record<string | number, unknown>;

export const propReMapping = new WeakMap<
  ComponentType<any>,
  PropRemaperFunction
>();

export function createPropRemapper(
  mapping: Record<string | number, string | true>,
) {
  const entries = Object.entries(mapping);

  return ({ ...props }: Record<string | number, unknown>) => {
    for (const [key, value] of entries) {
      let classNames: unknown;
      if (typeof value === "string") {
        classNames = props[value];
        delete props[value];
      } else {
        classNames = props[key];
      }

      if (typeof classNames === "string") {
        // Split className string into an array of class names, then map each class
        // name to its corresponding global style object, if one exists.
        const classNameStyle = classNames
          .split(/\s+/)
          .map((s) => globalStyles.get(s))
          .filter(Boolean);

        if (classNameStyle.length > 0) {
          const existingStyles = props[key];
          let newProp = Array.isArray(existingStyles)
            ? [...classNameStyle, ...existingStyles]
            : props[key]
            ? [...classNameStyle, props[key]]
            : classNameStyle;

          // If there is only one style in the resulting array, replace the array with that single style.
          if (Array.isArray(newProp) && newProp.length <= 1) {
            newProp = newProp[0];
          }

          props[key] = newProp;
        }
      }
    }

    return props;
  };
}

export function render(
  jsx: JSXFunction,
  type: any,
  props: Record<string | number, unknown>,
  key?: string,
  propRemapper = propReMapping.get(type),
  cssInterop = interopMapping.get(type),
) {
  if (propRemapper) {
    props = propRemapper(props);
  }

  return cssInterop ? cssInterop(jsx, type, props, key) : jsx(type, props, key);
}
