const supportedValues = new Set(["visible", "hidden", "scroll"]);

export function overflow(value: string) {
  if (supportedValues.has(value)) {
    return value;
  }

  return null;
}
