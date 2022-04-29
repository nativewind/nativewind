import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Auto Columns",
  expectError([
    "auto-cols-auto",
    "auto-cols-min",
    "auto-cols-max",
    "auto-cols-fr",
  ])
);
