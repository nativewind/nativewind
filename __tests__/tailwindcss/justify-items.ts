import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Layout - Justify Items",
  expectError([
    "justify-items-start",
    "justify-items-end",
    "justify-items-center",
    "justify-items-stretch",
  ])
);
