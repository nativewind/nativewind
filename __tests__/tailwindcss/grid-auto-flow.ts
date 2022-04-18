import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Grid Auto Flow",
  emptyResults([
    "grid-flow-row",
    "grid-flow-col",
    "grid-flow-row-dense",
    "grid-flow-col-dense",
  ])
);
