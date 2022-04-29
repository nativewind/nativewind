import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Object Position",
  expectError([
    "object-bottom",
    "object-center",
    "object-left",
    "object-left-bottom",
    "object-left-top",
    "object-right",
    "object-right-bottom",
    "object-right-top",
    "object-top",
  ])
);
