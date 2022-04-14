import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Clear",
  emptyResults(["clear-right", "clear-left", "clear-both", "clear-none"])
);
