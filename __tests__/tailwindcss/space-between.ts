import { expectError, tailwindRunner, spacing } from "./runner";

tailwindRunner(
  "Layout - Space between",
  expectError([
    ...Object.keys(spacing).map((space) => `space-x-${space}`),
    ...Object.keys(spacing).map((space) => `space-y-${space}`),
    "space-x-reverse",
    "space-y-reverse",
  ])
);
