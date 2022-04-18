import { generateTestsForScales, tailwindRunner } from "./runner";

const sizes: Record<string | number, any> = {
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
  generateTestsForScales("p", Object.keys(sizes), (i) => ({
    paddingBottom: sizes[i],
    paddingLeft: sizes[i],
    paddingRight: sizes[i],
    paddingTop: sizes[i],
  })),

  generateTestsForScales("px", Object.keys(sizes), (i) => ({
    paddingLeft: sizes[i],
    paddingRight: sizes[i],
  })),

  generateTestsForScales("py", Object.keys(sizes), (i) => ({
    paddingTop: sizes[i],
    paddingBottom: sizes[i],
  })),

  generateTestsForScales("pt", Object.keys(sizes), (i) => ({
    paddingTop: sizes[i],
  })),

  generateTestsForScales("pr", Object.keys(sizes), (i) => ({
    paddingRight: sizes[i],
  })),

  generateTestsForScales("pb", Object.keys(sizes), (i) => ({
    paddingBottom: sizes[i],
  })),

  generateTestsForScales("pl", Object.keys(sizes), (i) => ({
    paddingLeft: sizes[i],
  })),
].flat();

tailwindRunner("Layout - Top Right Bottom Left", tests);
