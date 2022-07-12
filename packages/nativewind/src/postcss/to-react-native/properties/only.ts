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
  auto?: boolean;
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
    auto,
  }: OnlyOptions<T, S> = Array.isArray(options) ? { values: options } : options;

  const callback = (value: string, name: string) => {
    const float = Number.parseFloat(value);
    const isNaN = Number.isNaN(float);
    const isAuto = value === "auto";

    if (isFunctionValue(value)) {
      /**
       * This is a hack to support platform values: hairlineWidth()
       *
       * We need to preserve this value all the way to the style serialization
       * where they are outputted as runtime values: StyleSheet.hairlineWidth
       *
       * But we also need to convert shorthand css property names to their long form
       *
       * so { borderWidth: styleSheet(hairlineWidth() } needs to be turned into
       *
       * {
       *  "borderBottomWidth": "hairlineWidth()",
       *  "borderLeftWidth": "hairlineWidth()",
       *  "borderRightWidth": "hairlineWidth()",
       *  "borderTopWidth": "hairlineWidth()",
       * }
       *
       * We achieve this by generating a fake style object and replacing its values.
       */
      const fakePropertyStyles =
        number || units
          ? getStylesForProperty(name, "1px")
          : getStylesForProperty(name, "transparent");

      return Object.fromEntries(
        Object.entries(fakePropertyStyles).map(([key]) => [key, value])
      );
    }

    if (auto && isAuto) {
      return Object.fromEntries(
        Object.entries(getStylesForProperty(name, "1px")).map(([key]) => [
          key,
          value,
        ])
      );
    }

    if (number) {
      if (isNaN) {
        throw new Error(name);
      } else if (units && float.toString() === value) {
        return getStylesForProperty(name, `${float}${units[0]}`);
      }

      if (!units) {
        return getStylesForProperty(name, value);
      } else if (units.some((unit) => value.endsWith(unit))) {
        return getStylesForProperty(name, value);
      }
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

function isFunctionValue(value: string) {
  return value.includes("(");
}
