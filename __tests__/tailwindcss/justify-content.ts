import { generateTestsForScales, tailwindRunner } from "./runner";

const options: Record<string, string> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

tailwindRunner(
  "Layout - Justify Content",
  generateTestsForScales("justify", Object.keys(options), (n) => ({
    justifyContent: options[n],
  }))
);
