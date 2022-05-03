import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "SVG - Stroke Width",
  expectError(["stroke-0", "stroke-1", "stroke-2"])
);
