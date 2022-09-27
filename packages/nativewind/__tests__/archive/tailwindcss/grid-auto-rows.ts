import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Grid Auto Row",
  expectError([
    "auto-rows-auto",
    "auto-rows-min",
    "auto-rows-max",
    "auto-rows-fr",
  ])
);
