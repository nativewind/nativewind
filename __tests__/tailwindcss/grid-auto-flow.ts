import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Auto Flow",
  expectError([
    "grid-flow-row",
    "grid-flow-col",
    "grid-flow-row-dense",
    "grid-flow-col-dense",
  ])
);
