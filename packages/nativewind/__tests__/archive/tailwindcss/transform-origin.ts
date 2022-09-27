import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Transforms - Transform Origin",
  expectError([
    "origin-center",
    "origin-top",
    "origin-top-right",
    "origin-right",
    "origin-bottom-right",
    "origin-bottom",
    "origin-bottom-left",
    "origin-left",
    "origin-top-left",
  ])
);
