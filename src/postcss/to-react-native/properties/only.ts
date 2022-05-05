import { getStylesForProperty, Style } from "css-to-react-native";
import { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type PropertyGuard<T extends string> = (
  value: string,
  name: string
) => PropertyFunction<T>;

export interface PropertyFunction<T extends string> {
  prop?: T;
  (value: string, name: string): Style;
}

interface OnlyOptions<
  T extends keyof S,
  S extends TextStyle | ViewStyle | ImageStyle =
    | TextStyle
    | ViewStyle
    | ImageStyle
> {
  values?: Array<S[T]>;
  units?: string[];
  number?: boolean;
  color?: boolean;
}

// eslint-disable-next-line unicorn/consistent-function-scoping
export function noop<T extends string>(): PropertyFunction<T> {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const callback = (value: string, name: string) => {
    return getStylesForProperty(name, value);
  };
  callback.prop = "" as T;
  return callback;
}

export function only<
  T extends keyof S & string,
  S extends TextStyle | ViewStyle | ImageStyle =
    | TextStyle
    | ViewStyle
    | ImageStyle
>(options: Array<S[T]> | OnlyOptions<T, S>): PropertyFunction<T> {
  const {
    values = [],
    units,
    number,
    color,
  }: OnlyOptions<T, S> = Array.isArray(options) ? { values: options } : options;

  const callback = (value: string, name: string) => {
    const isNaN = Number.isNaN(Number.parseInt(value));

    if (number) {
      if (isNaN) {
        throw new Error(name);
      }
      return getStylesForProperty(name, value);
    }

    if (
      (color &&
        (value.startsWith("#") ||
          value.startsWith("rgb(") ||
          value.startsWith("rgba(") ||
          value.startsWith("hsl("))) ||
      value === "transparent"
    ) {
      return getStylesForProperty(name, value);
    }

    if (!isNaN && units?.some((unit) => value.endsWith(unit))) {
      return getStylesForProperty(name, value);
    }

    if (values.includes(value as unknown as S[T])) {
      return getStylesForProperty(name, value);
    }

    throw new Error(name);
  };

  return callback;
}
