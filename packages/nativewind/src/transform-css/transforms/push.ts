import {
  invalidGlobalValues,
  invalidKeywordValues,
  StyleProperty,
  validProperties,
} from "./valid-styles";
import { AtomStyle, SelectorMeta, StyleValue } from "../types";
import { encodeValue } from "../encode-value";

export interface PushStyleOptions {
  // This only exists to force fontWeight into a string :(
  forceString?: boolean;
  // This only exists for shadow
  forceFunction?: string;
}

export function pushStyle(
  styles: AtomStyle[],
  property: string,
  meta: SelectorMeta,
  node: StyleValue | null | undefined,
  { forceString = false, forceFunction }: PushStyleOptions = {}
) {
  if (!node) return;

  let value = encodeValue(node, meta.subscriptions);
  if (forceString) value = value?.toString();
  if (forceFunction) {
    value = { function: forceFunction, values: [value] } as StyleValue;
  }

  if (value === undefined || value === null) return;

  // To camelCase
  const styleProperty = property.replace(/-./g, (x) =>
    x[1].toUpperCase()
  ) as StyleProperty;

  const styleProperties = validProperties[styleProperty];

  let isValid = styleProperties === true;

  if (typeof value === "string") {
    if (styleProperty === "flexBasis" && value === "auto") {
      // This is the only exception to the global values
      isValid = true;
    } else if (invalidGlobalValues.has(value)) {
      isValid = false;
    } else if (invalidKeywordValues[styleProperty]?.includes(value)) {
      isValid = false;
    } else if (Array.isArray(styleProperties)) {
      isValid = styleProperties.includes(value);
    }
  }

  if (isValid) {
    styles.push({
      [styleProperty]: value,
    });
  }
}
