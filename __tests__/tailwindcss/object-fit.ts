import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Object Fit",
  emptyResults([
    "object-contain",
    "object-cover",
    "object-fill",
    "object-none",
    "object-scale-down",
  ])
);
