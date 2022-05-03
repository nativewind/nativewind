import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Scroll Behaviour",
  expectError(["scroll-auto", "scroll-smooth"])
);
