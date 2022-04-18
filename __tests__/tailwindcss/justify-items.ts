import { emptyResults, tailwindRunner } from "./runner";

tailwindRunner(
  "Layout - Justify Items",
  emptyResults([
    "justify-items-start",
    "justify-items-end",
    "justify-items-center",
    "justify-items-stretch",
  ])
);
