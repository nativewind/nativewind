import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Transitions & Animation - Transition Timing Function",
  expectError(["ease-linear", "ease-in", "ease-out", "ease-in-out"])
);
