import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Touch Action",
  expectError(["select-none", "select-text", "select-all", "select-auto"])
);
