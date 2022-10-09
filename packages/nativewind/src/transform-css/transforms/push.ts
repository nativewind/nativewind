import { validProperties } from "./valid-styles";
import { DeclarationAtom, StyleValue } from "../types";
import { encodeValue } from "../encode-value";

export function pushStyle(
  atom: DeclarationAtom,
  property: string,
  node?: StyleValue | null
) {
  if (!node) return;

  const topics: string[] = [];
  // This mutates topics, theres probably a better way to write this
  const value = encodeValue(node, topics);

  if (value === undefined || value === null) return;

  atom.topics ??= [];
  atom.topics.push(...topics);

  // To camelCase
  const styleProperty = property.replace(/-./g, (x) => x[1].toUpperCase());

  if (validProperties.has(styleProperty)) {
    atom.styles.push({
      [styleProperty]: value,
    });
  }
}
