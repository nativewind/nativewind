import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Position",
  expectError([
    "bg-bottom",
    "bg-center",
    "bg-left",
    "bg-left-bottom",
    "bg-left-top",
    "bg-right",
    "bg-right-bottom",
    "bg-right-top",
    "bg-top",
  ])
);
