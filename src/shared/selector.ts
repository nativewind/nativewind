import { TailwindConfig } from "tailwindcss/tailwind-config";

/**
 * Normalise a selector so it can be used as an object key
 */
export function normaliseSelector(
  selector: string,
  { important }: Partial<TailwindConfig> = {}
) {
  const leadingDots = "^\\.";

  const regex =
    typeof important === "string"
      ? new RegExp(`^${important}|${leadingDots}`)
      : new RegExp(leadingDots);

  return selector.replace(regex, "").replace(/\s/g, "_");
}
