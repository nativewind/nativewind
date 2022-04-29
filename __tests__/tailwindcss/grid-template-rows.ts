import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Template Row",
  expectError([
    "grid-rows-1",
    "grid-rows-2",
    "grid-rows-none",
    "grid-rows-[200px_minmax(900px,_1fr)_100px]",
  ])
);
