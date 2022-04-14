export function display(value: string) {
  if (value !== "none" && value !== "flex") {
    return null;
  }

  return value;
}
