import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Invert",
  expectError(["backdrop-invert-0", "backdrop-invert"])
);
