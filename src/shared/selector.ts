import { TailwindConfig } from "tailwindcss/tailwind-config";

/**
 * normalize a selector to be object key friendly
 *
 * We also remove non-word characters for readability/testing purposes
 */
export function normalizeSelector(
  selector: string,
  { important }: Partial<TailwindConfig> = {}
) {
  const leadingDots = "^\\.";
  const nonWordCharactersExceptDashAndSpaces = new RegExp(
    "[^a-zA-Z0-9-\\s]+",
    "g"
  );

  if (important) {
    selector = selector.replace(new RegExp(`^${important}`), "");
  }

  return selector
    .trim()
    .replace(new RegExp(leadingDots), "")
    .replace(nonWordCharactersExceptDashAndSpaces, "_");
}
