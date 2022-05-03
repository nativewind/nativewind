import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Transitions & Animation - Transition Duration",
  expectError([
    "duration-75",
    "duration-100",
    "duration-150",
    "duration-200",
    "duration-300",
    "duration-500",
    "duration-700",
    "duration-1000",
  ])
);
