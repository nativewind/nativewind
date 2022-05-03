import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Vertical Alignment",
  expectError([
    "align-baseline",
    "align-top",
    "align-middle",
    "align-bottom",
    "align-text-top",
    "align-text-bottom",
    "align-sub",
    "align-super",
  ])
);
