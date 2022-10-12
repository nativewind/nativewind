import { StyleProperty, validProperties } from "./valid-styles";
import { AtomStyle, SelectorMeta, StyleValue } from "../types";
import { encodeValue } from "../encode-value";

export function pushStyle(
  styles: AtomStyle[],
  property: string,
  meta: SelectorMeta,
  node?: StyleValue | null
) {
  if (!node) return;

  const value = encodeValue(node, meta.topics);

  if (value === undefined || value === null) return;

  // To camelCase
  const styleProperty = property.replace(/-./g, (x) =>
    x[1].toUpperCase()
  ) as StyleProperty;

  let isValid = false;
  const styleProperties = validProperties[styleProperty];

  if (styleProperties === true) {
    isValid = true;
  } else if (Array.isArray(styleProperties) && typeof value === "string") {
    isValid = styleProperties.includes(value);
  }

  if (isValid) {
    styles.push({
      [styleProperty]: value,
    });
  }
}
