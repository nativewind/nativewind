import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Isolation",
  expectError(["isolate", "isolation-auto"])
);
