const supportedValues = new Set(["absolute", "relative"]);

export function position(value: string) {
  if (supportedValues.has(value)) {
    return value;
  }

  // This is a special edge case
  // The tailwindcss keeps picking up `static` as its a javascript keyword
  // We cannot return `null` (and show the warning) as the user isn't
  // actualy using the className
  if (value === "static") {
    return;
  }

  return null;
}
