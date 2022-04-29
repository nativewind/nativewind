import {
  emptyResults,
  generateTestsForScales,
  tailwindRunner,
  spacing,
} from "./runner";

const tests = [
  generateTestsForScales("m", Object.keys(spacing), (index) => ({
    marginBottom: spacing[index],
    marginLeft: spacing[index],
    marginRight: spacing[index],
    marginTop: spacing[index],
  })),

  generateTestsForScales("mx", Object.keys(spacing), (index) => ({
    marginLeft: spacing[index],
    marginRight: spacing[index],
  })),

  generateTestsForScales("my", Object.keys(spacing), (index) => ({
    marginTop: spacing[index],
    marginBottom: spacing[index],
  })),

  generateTestsForScales("mt", Object.keys(spacing), (index) => ({
    marginTop: spacing[index],
  })),

  generateTestsForScales("mr", Object.keys(spacing), (index) => ({
    marginRight: spacing[index],
  })),

  generateTestsForScales("mb", Object.keys(spacing), (index) => ({
    marginBottom: spacing[index],
  })),

  generateTestsForScales("ml", Object.keys(spacing), (index) => ({
    marginLeft: spacing[index],
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

tailwindRunner("Layout - Margin", tests);
