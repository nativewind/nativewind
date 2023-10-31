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
  // Important first
  if (a.I !== b.I) {
    return a.I - b.I;
  } else if (a.I || b.I) {
    return a.I ? 1 : -1;
  } else if ((a.inline || a.remapped) && (b.inline || b.remapped)) {
    // Then inline/remapped
    return 1;
  } else if (a.inline || b.inline) {
    // If one is inline, it goes first
    return a.inline ? 1 : -1;
  } else if (a.A !== b.A) {
    // Ids
    return a.A - b.A;
  } else if (a.B !== b.B) {
    // Classes
    return a.B - b.B;
  } else if (a.C !== b.C) {
    // Styles
    return a.C - b.C;
  } else if (a.S !== b.S) {
    // StyleSheet Order
    return a.S - b.S;
  } else if (a.O !== b.O) {
    // Appearance Order
    return a.O - b.O;
  } else {
    // They are the same?
    return 0;
  }
}
