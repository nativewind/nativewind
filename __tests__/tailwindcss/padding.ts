import { generateTestsForScales, tailwindRunner } from "./runner";

const sizes: Record<string | number, number> = {
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
  generateTestsForScales("p", Object.keys(sizes), (index) => ({
    paddingBottom: sizes[index],
    paddingLeft: sizes[index],
    paddingRight: sizes[index],
    paddingTop: sizes[index],
  })),

  generateTestsForScales("px", Object.keys(sizes), (index) => ({
    paddingLeft: sizes[index],
    paddingRight: sizes[index],
  })),

  generateTestsForScales("py", Object.keys(sizes), (index) => ({
    paddingTop: sizes[index],
    paddingBottom: sizes[index],
  })),

  generateTestsForScales("pt", Object.keys(sizes), (index) => ({
    paddingTop: sizes[index],
  })),

  generateTestsForScales("pr", Object.keys(sizes), (index) => ({
    paddingRight: sizes[index],
  })),

  generateTestsForScales("pb", Object.keys(sizes), (index) => ({
    paddingBottom: sizes[index],
  })),

  generateTestsForScales("pl", Object.keys(sizes), (index) => ({
    paddingLeft: sizes[index],
  })),
].flat();

tailwindRunner("Layout - Top Right Bottom Left", tests);
