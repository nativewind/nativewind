import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Transitions & Animation - Animation",
  expectError([
    "animate-none",
    // "animate-spin",
    // "animate-ping",
    // "animate-pulse",
    // "animate-bounce",
  ])
);
