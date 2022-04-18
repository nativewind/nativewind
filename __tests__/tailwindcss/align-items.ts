import { generateTestsForScales, tailwindRunner } from "./runner";

const options: Record<string, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
};

tailwindRunner(
  "Layout - Align Items",
  generateTestsForScales("items", Object.keys(options), (n) => ({
    alignItems: options[n],
  }))
);
