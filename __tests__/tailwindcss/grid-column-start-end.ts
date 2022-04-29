import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Column Start / End",
  expectError([
    "col-auto",
    "col-span-1",
    "col-span-full",
    "col-start-1",
    "col-start-auto",
    "col-end-1",
    "col-end-auto",
  ])
);
