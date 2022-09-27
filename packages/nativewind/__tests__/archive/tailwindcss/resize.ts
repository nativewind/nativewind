import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Resize",
  expectError(["resize-none", "resize-y", "resize-x", "resize"])
);
