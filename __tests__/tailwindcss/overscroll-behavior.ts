import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Overscroll Behavior",
  expectError([
    "overscroll-auto",
    "overscroll-contain",
    "overscroll-none",
    "overscroll-y-auto",
    "overscroll-y-contain",
    "overscroll-y-none",
    "overscroll-x-auto",
    "overscroll-x-contain",
    "overscroll-x-none",
  ])
);
