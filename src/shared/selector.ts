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
  const nonWordCharactersExceptDash = new RegExp("[^a-zA-Z0-9-]+", "g");

  const importantOrLeadingDots =
    typeof important === "string"
      ? new RegExp(`^${important}|${leadingDots}`)
      : new RegExp(leadingDots);

  return selector
    .replace(importantOrLeadingDots, "")
    .replace(nonWordCharactersExceptDash, "_");
}
