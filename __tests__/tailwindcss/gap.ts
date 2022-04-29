import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Gap",
  expectError([
    "gap-0",
    "gap-x-0",
    "gap-y-0",
    "gap-px",
    "gap-x-px",
    "gap-y-px",
    "gap-0.5",
    "gap-x-0.5",
    "gap-y-0.5",
    "gap-1",
    "gap-x-1",
    "gap-y-1",
  ])
);
