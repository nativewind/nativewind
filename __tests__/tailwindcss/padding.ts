import { generateTestsForScales, tailwindRunner, spacing } from "./runner";

const tests = [
  generateTestsForScales("p", Object.keys(spacing), (index) => ({
    paddingBottom: spacing[index],
    paddingLeft: spacing[index],
    paddingRight: spacing[index],
    paddingTop: spacing[index],
  })),

  generateTestsForScales("px", Object.keys(spacing), (index) => ({
    paddingLeft: spacing[index],
    paddingRight: spacing[index],
  })),

  generateTestsForScales("py", Object.keys(spacing), (index) => ({
    paddingTop: spacing[index],
    paddingBottom: spacing[index],
  })),

  generateTestsForScales("pt", Object.keys(spacing), (index) => ({
    paddingTop: spacing[index],
  })),

  generateTestsForScales("pr", Object.keys(spacing), (index) => ({
    paddingRight: spacing[index],
  })),

  generateTestsForScales("pb", Object.keys(spacing), (index) => ({
    paddingBottom: spacing[index],
  })),

  generateTestsForScales("pl", Object.keys(spacing), (index) => ({
    paddingLeft: spacing[index],
  })),
].flat();

tailwindRunner("Layout - Top Right Bottom Left", tests);
