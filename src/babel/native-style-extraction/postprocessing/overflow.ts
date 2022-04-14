const supportedValues = ["visible", "hidden", "scroll"];
export function overflow(value: string) {
  if (supportedValues.includes(value)) {
    return value;
  }

  return null;
}
