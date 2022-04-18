import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Grid Auto Row",
  emptyResults([
    "auto-rows-auto",
    "auto-rows-min",
    "auto-rows-max",
    "auto-rows-fr",
  ])
);
