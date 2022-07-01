import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Drop Shadow",
  expectError([
    "drop-shadow-sm",
    "drop-shadow",
    "drop-shadow-md",
    "drop-shadow-lg",
    "drop-shadow-xl",
    "drop-shadow-2xl",
    "drop-shadow-none",
  ])
);
