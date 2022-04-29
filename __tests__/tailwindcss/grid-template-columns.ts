import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Template Columns",
  expectError([
    "grid-cols-1",
    "grid-cols-2",
    "grid-cols-none",
    "grid-cols-[200px_minmax(900px,_1fr)_100px]",
  ])
);
