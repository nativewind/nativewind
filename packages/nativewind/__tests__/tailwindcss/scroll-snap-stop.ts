import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Scroll Snap Stop",
  expectError(["snap-normal", "snap-always"])
);
