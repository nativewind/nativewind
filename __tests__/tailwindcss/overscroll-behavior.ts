import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner(
  "Layout - Overscroll Behavior",
  emptyResults([
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
