import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Place Self",
  expectError([
    "place-self-auto",
    "place-self-start",
    "place-self-end",
    "place-self-center",
    "place-self-stretch",
  ])
);
