import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Float",
  expectError(["float-right", "float-left", "float-none"])
);
