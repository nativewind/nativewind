import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Hue Rotate",
  expectError([
    "backdrop-hue-rotate-0",
    "backdrop-hue-rotate-15",
    "backdrop-hue-rotate-30",
    "backdrop-hue-rotate-60",
    "backdrop-hue-rotate-90",
    "backdrop-hue-rotate-180",
  ])
);
