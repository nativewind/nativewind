import { Specificity } from "../types";
import { getSpecificity } from "./native/stylesheet";

export function styleSpecificityCompareFn(a?: object, b?: object) {
  const specificityA = getSpecificity(a);
  const specificityB = getSpecificity(b);
  return specificityCompare(specificityA, specificityB);
}

function specificityCompare(a: Specificity, b: Specificity) {
  // Inline overrides specificity, and maintain order of appearance
  if ("inline" in a && "inline" in b) {
    return 0;
  } else if ("inline" in a) {
    return 1; // A > B
  } else if ("inline" in b) {
    return -1; // B > A
  } else if ("A" in a && "A" in b) {
    // Important styles are always last
    if (a.I !== b.I) {
      return a.I - b.I;
    }

    // Ids
    if (a.A !== b.A) {
      return a.A - b.A;
    }

    // Classes
    if (a.B !== b.B) {
      return a.B - b.B;
    }

    // Styles
    if (a.C !== b.C) {
      return a.C - b.C;
    }

    // Styles have the same specificity, so we need to compare the order

    // StyleSheet Order
    if (a.S !== b.S) {
      return a.S - b.S;
    }

    // Appearance Order
    return a.O - b.O;
  }

  return 0;
}
