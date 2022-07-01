import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Layout - Box Decoration Break",
  expectError(["box-decoration-clone", "box-decoration-slice"])
);
