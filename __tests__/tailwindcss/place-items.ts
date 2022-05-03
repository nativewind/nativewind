import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Place Items",
  expectError([
    "place-items-start",
    "place-items-end",
    "place-items-center",
    "place-items-stretch",
  ])
);
