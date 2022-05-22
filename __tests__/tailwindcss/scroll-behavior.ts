import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Scroll Behavior",
  expectError(["scroll-auto", "scroll-smooth"])
);
