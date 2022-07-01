import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Grayscale",
  expectError(["grayscale-0", "grayscale"])
);
