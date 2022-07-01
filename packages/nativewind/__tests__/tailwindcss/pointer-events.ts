import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Pointer Events",
  expectError(["pointer-events-none", "pointer-events-auto"])
);
