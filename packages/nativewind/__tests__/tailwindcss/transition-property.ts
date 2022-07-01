import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Transitions & Animation - Transition Property",
  expectError([
    "transition-none",
    "transition-all",
    "transition",
    "transition-colors",
    "transition-opacity",
    "transition-shadow",
    "transition-transform",
  ])
);
