import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Grayscale",
  expectError(["backdrop-grayscale-0", "backdrop-grayscale"])
);
