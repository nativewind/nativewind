import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Scroll Snap Align",
  expectError(["snap-start", "snap-end", "snap-center", "snap-align-none"])
);
