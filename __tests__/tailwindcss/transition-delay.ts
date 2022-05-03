import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Transitions & Animation - Transition Delay",
  expectError([
    "delay-75",
    "delay-100",
    "delay-150",
    "delay-200",
    "delay-300",
    "delay-500",
    "delay-700",
    "delay-1000",
  ])
);
