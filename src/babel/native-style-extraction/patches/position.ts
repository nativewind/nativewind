const supportedValues = new Set(["absolute", "relative"]);

export function position(value: string) {
  if (supportedValues.has(value)) {
    return value;
  }

  return null;
}
