import { tailwindRunner, emptyResults, generateTestsForScales } from "./runner";

const scales: Record<string, number> = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  50: 50,
  "[100]": 100,
};

tailwindRunner("Layout - Z-Index", [
  ...emptyResults(["z-auto"]),
  ...generateTestsForScales("z", Object.keys(scales), (n) => ({
    zIndex: scales[n],
  })),
]);
