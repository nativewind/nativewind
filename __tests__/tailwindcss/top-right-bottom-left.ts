import { generateTestsForScales, tailwindRunner } from "./runner";

const expectedValues: Record<string | number, any> = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
  36: 144,
  40: 160,
  44: 176,
  48: 192,
  52: 208,
  56: 224,
  60: 240,
  64: 256,
  72: 288,
  80: 320,
  96: 384,
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  full: "100%",
};

const sizes = Object.keys(expectedValues);

const generateTopRightBottomLeftTest = (prefix: string, keys: string[]) => {
  return generateTestsForScales(prefix, sizes, (i: string | number) => {
    return Object.fromEntries(keys.map((key) => [key, expectedValues[i]]));
  });
};

const tests = [
  generateTopRightBottomLeftTest("inset", ["top", "right", "bottom", "left"]),
  generateTopRightBottomLeftTest("inset-x", ["right", "left"]),
  generateTopRightBottomLeftTest("inset-y", ["top", "bottom"]),
  generateTopRightBottomLeftTest("inset-x", ["right", "left"]),
  generateTopRightBottomLeftTest("inset-y", ["top", "bottom"]),
  generateTopRightBottomLeftTest("top", ["top"]),
  generateTopRightBottomLeftTest("right", ["right"]),
  generateTopRightBottomLeftTest("bottom", ["bottom"]),
  generateTopRightBottomLeftTest("left", ["left"]),
].flat();

tailwindRunner("Layout - Top Right Bottom Left", tests);
