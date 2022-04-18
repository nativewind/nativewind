import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Grid Template Row",
  emptyResults([
    "grid-rows-1",
    "grid-rows-2",
    "grid-rows-3",
    "grid-rows-4",
    "grid-rows-5",
    "grid-rows-6",
    "grid-rows-7",
    "grid-rows-8",
    "grid-rows-9",
    "grid-rows-10",
    "grid-rows-11",
    "grid-rows-12",
    "grid-rows-none",
    "grid-rows-[200px_minmax(900px,_1fr)_100px]",
  ])
);
