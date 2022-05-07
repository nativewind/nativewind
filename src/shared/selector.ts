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
  if (selector.startsWith("--")) return selector.slice(2);

  const leadingDots = "^\\.";
  const nonWordCharactersExceptDash = new RegExp("[^a-zA-Z0-9-]+", "g");

  let newSelector = selector;

  if (important) {
    newSelector = newSelector.replace(new RegExp(`^${important}`), "");
  }

  return newSelector
    .trim()
    .replace(new RegExp(leadingDots), "")
    .replace(nonWordCharactersExceptDash, "_");
}
