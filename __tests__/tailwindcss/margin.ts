import { emptyResults, generateTestsForScales, tailwindRunner } from "./runner";

const sizes: Record<string, number> = {
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
};

const tests = [
  generateTestsForScales("m", Object.keys(sizes), (index) => ({
    marginBottom: sizes[index],
    marginLeft: sizes[index],
    marginRight: sizes[index],
    marginTop: sizes[index],
  })),

  generateTestsForScales("mx", Object.keys(sizes), (index) => ({
    marginLeft: sizes[index],
    marginRight: sizes[index],
  })),

  generateTestsForScales("my", Object.keys(sizes), (index) => ({
    marginTop: sizes[index],
    marginBottom: sizes[index],
  })),

  generateTestsForScales("mt", Object.keys(sizes), (index) => ({
    marginTop: sizes[index],
  })),

  generateTestsForScales("mr", Object.keys(sizes), (index) => ({
    marginRight: sizes[index],
  })),

  generateTestsForScales("mb", Object.keys(sizes), (index) => ({
    marginBottom: sizes[index],
  })),

  generateTestsForScales("ml", Object.keys(sizes), (index) => ({
    marginLeft: sizes[index],
  })),

  emptyResults([
    "m-auto",
    "mx-auto",
    "my-auto",
    "mt-auto",
    "mr-auto",
    "mb-auto",
    "ml-auto",
  ]),
].flat();

tailwindRunner("Layout - Top Right Bottom Left", tests);
