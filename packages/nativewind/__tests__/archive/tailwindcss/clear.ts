import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Clear",
  expectError(["clear-right", "clear-left", "clear-both", "clear-none"])
);
