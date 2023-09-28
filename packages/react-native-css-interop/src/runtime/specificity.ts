import { Specificity } from "../types";
import { getSpecificity } from "./native/stylesheet";

export function styleSpecificityCompareFn(direction = "asc") {
  return (a?: object, b?: object) => {
    return (
      specificityCompare(getSpecificity(a), getSpecificity(b)) *
      (direction === "asc" ? 1 : -1)
    );
  };
}

export function specificityCompare(a: Specificity, b: Specificity) {
  if ("inline" in a && "inline" in b) {
    return 0;
  } else if ("inline" in a) {
    return "I" in b && b.I ? -1 : 1;
  } else if ("inline" in b) {
    return "I" in a && a.I ? 1 : -1;
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
