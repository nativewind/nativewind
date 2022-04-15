export function left(value: number | string) {
  if (value === "auto") {
    return null;
  }

  return value;
}
