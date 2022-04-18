import { emptyResults, tailwindRunner } from "./runner";

tailwindRunner(
  "Layout - Justify Items",
  emptyResults([
    "justify-self-auto",
    "justify-self-start",
    "justify-self-end",
    "justify-self-center",
    "justify-self-stretch",
  ])
);
