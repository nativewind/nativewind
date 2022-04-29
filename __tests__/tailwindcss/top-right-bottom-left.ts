import { expectError, createTests, tailwindRunner } from "./runner";

const expectedValues: Record<string, number | string> = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  96: 384,
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  full: "100%",
  "[18px]": 18,
};

tailwindRunner("Layout - Top Right Bottom Left", [
  // prettier-ignore
  ...createTests("inset", expectedValues, (n) => ({ top: n, right: n, bottom: n, left: n })),
  ...createTests("inset-x", expectedValues, (n) => ({ right: n, left: n })),
  ...createTests("inset-y", expectedValues, (n) => ({ top: n, bottom: n })),
  ...createTests("top", expectedValues, (n) => ({ top: n })),
  ...createTests("right", expectedValues, (n) => ({ right: n })),
  ...createTests("bottom", expectedValues, (n) => ({ bottom: n })),
  ...createTests("left", expectedValues, (n) => ({ left: n })),

  ...expectError([
    "inset-auto",
    "inset-x-auto",
    "inset-y-auto",
    "top-auto",
    "right-auto",
    "bottom-auto",
    "left-auto",
  ]),
]);
