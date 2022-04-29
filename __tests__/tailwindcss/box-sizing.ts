import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Box Sizing",
  expectError(["box-border", "box-content"])
);
