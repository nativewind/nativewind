import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Saturate",
  expectError([
    "backdrop-saturate-0",
    "backdrop-saturate-50",
    "backdrop-saturate-100",
    "backdrop-saturate-150",
    "backdrop-saturate-200",
  ])
);
