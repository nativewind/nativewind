export function isDeepEqual(a: unknown, b: unknown): boolean {
  const aArray = Array.isArray(a);
  const bArray = Array.isArray(b);
  const requiresKeyComparison =
    typeof a === "object" && typeof b === "object" && aArray === bArray;

  // Only compare keys when both are an object or array
  // This does not account for complex types like Date/Regex, because we don't use them
  if (!requiresKeyComparison) return a === b;

  // We don't actually support nulls, this is to make TypeScript happy
  if (!a || !b) {
    return a === b;
  }

  // Shortcut for arrays
  if (aArray && bArray && a.length !== b.length) {
    return false;
  }

  // Compare a to b
  for (const key in a) {
    if (
      !isDeepEqual(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key],
      )
    ) {
      return false;
    }
  }

  // Compare b to a
  for (const key in b) {
    if (!(key in a)) {
      return false;
    }
  }

  return true;
}
