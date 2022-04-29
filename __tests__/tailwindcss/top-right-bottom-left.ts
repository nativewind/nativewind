import {
  emptyResults,
  generateTestsForScales,
  spacing,
  tailwindRunner,
} from "./runner";

const expectedValues: Record<string, number | string> = {
  ...spacing,
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  full: "100%",
  "[18px]": 18,
};

const generateTopRightBottomLeftTest = (prefix: string, keys: string[]) => {
  return generateTestsForScales(
    prefix,
    Object.keys(expectedValues),
    (index) => {
      return Object.fromEntries(
        keys.map((key) => [key, expectedValues[index]])
      );
    }
  );
};

const tests = [
  generateTopRightBottomLeftTest("inset", ["top", "right", "bottom", "left"]),
  generateTopRightBottomLeftTest("inset-x", ["right", "left"]),
  generateTopRightBottomLeftTest("inset-y", ["top", "bottom"]),
  generateTopRightBottomLeftTest("top", ["top"]),
  generateTopRightBottomLeftTest("right", ["right"]),
  generateTopRightBottomLeftTest("bottom", ["bottom"]),
  generateTopRightBottomLeftTest("left", ["left"]),

  emptyResults([
    "insert-auto",
    "insert-x-auto",
    "insert-y-auto",
    "top-auto",
    "right-auto",
    "bottom-auto",
    "left-auto",
  ]),
].flat();

tailwindRunner("Layout - Top Right Bottom Left", tests);
