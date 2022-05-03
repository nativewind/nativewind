import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Saturate",
  expectError([
    "saturate-0",
    "saturate-50",
    "saturate-100",
    "saturate-150",
    "saturate-200",
  ])
);
