import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Grid Template Columns",
  emptyResults([
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-3",
    "grid-cols-4",
    "grid-cols-5",
    "grid-cols-6",
    "grid-cols-7",
    "grid-cols-8",
    "grid-cols-9",
    "grid-cols-10",
    "grid-cols-11",
    "grid-cols-12",
    "grid-cols-none",
    "grid-cols-[200px_minmax(900px,_1fr)_100px]",
  ])
);
