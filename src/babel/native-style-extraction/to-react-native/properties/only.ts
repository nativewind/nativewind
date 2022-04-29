import { getStylesForProperty, Style } from "css-to-react-native";
import { StyleProperty } from "../is-invalid-property";

type StyleCallback = (value: string) => Style;
interface OnlyOptions {
  values?: string[];
  units?: string[];
  number?: boolean;
}

export function only(name: StyleProperty, options: OnlyOptions): StyleCallback;
export function only(name: StyleProperty, values: string[]): StyleCallback;
export function only(name: StyleProperty, options: string[] | OnlyOptions) {
  const { values, units, number }: OnlyOptions = Array.isArray(options)
    ? { values: options }
    : options;

  const supportedValues = new Set(values);

  return (unparsedValue: string) => {
    if (number && Number.isNaN(Number.parseInt(unparsedValue))) {
      throw new Error(name);
    }

    const value = getStylesForProperty(name, unparsedValue)[name];

    if (typeof value === "number") {
      return { [name]: value };
    }

    if (
      typeof value === "string" &&
      units &&
      !Number.isNaN(Number.parseInt(value)) &&
      units.some((unit) => value.endsWith(unit))
    ) {
      return { [name]: value };
    }

    if (typeof value === "string" && values && supportedValues.has(value)) {
      return { [name]: value };
    }
    throw new Error(name);
  };
}
