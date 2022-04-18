import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Grid Auto Columns",
  emptyResults([
    "auto-cols-auto",
    "auto-cols-min",
    "auto-cols-max",
    "auto-cols-fr",
  ])
);
