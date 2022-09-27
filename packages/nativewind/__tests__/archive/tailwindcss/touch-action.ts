import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Touch Action",
  expectError([
    "touch-auto",
    "touch-none",
    "touch-pan-x",
    "touch-pan-left",
    "touch-pan-right",
    "touch-pan-y",
    "touch-pan-up",
    "touch-pan-down",
    "touch-pinch-zoom",
    "touch-manipulation",
  ])
);
