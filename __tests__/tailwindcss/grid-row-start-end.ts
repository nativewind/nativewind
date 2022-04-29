import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Row Start / End",
  expectError([
    "row-auto",
    "row-span-1",
    "row-span-2",
    "row-span-full",
    "row-start-1",
    "row-start-2",
    "row-start-auto",
    "row-end-1",
    "row-end-2",
    "row-end-auto",
  ])
);
