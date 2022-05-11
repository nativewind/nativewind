import { TailwindConfig } from "tailwindcss/tailwind-config";

/**
 * Normalise a selector to be object key friendly
 *
 * We also remove non-word characters for readability/testing purposes
 */
export function normaliseSelector(
  selector: string,
  { important }: Partial<TailwindConfig> = {}
) {
  const leadingDots = "^\\.";
  const leadingChild = "^>";
  const nonWordCharactersExceptDash = new RegExp("[^a-zA-Z0-9-]+", "g");

  if (important) {
    selector = selector.replace(new RegExp(`^${important}`), "");
  }

  return selector
    .trim()
    .replace(new RegExp(leadingDots), "")
    .replace(new RegExp(leadingChild), "")
    .replace(nonWordCharactersExceptDash, "_");
}
