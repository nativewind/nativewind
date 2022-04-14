const supportedValues = ["absolute", "relative"];
export function position(value: string) {
  if (supportedValues.includes(value)) {
    return value;
  }

  return null;
}
