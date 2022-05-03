import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Repeat",
  expectError([
    "bg-repeat",
    "bg-no-repeat",
    "bg-repeat-x",
    "bg-repeat-y",
    "bg-repeat-round",
    "bg-repeat-space",
  ])
);
