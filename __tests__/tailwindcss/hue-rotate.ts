import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Hue Rotate",
  expectError([
    "hue-rotate-0",
    "hue-rotate-15",
    "hue-rotate-30",
    "hue-rotate-60",
    "hue-rotate-90",
    "hue-rotate-180",
  ])
);
