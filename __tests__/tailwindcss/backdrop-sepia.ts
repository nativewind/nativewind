import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Saturate",
  expectError(["backdrop-sepia-0", "backdrop-sepia"])
);
