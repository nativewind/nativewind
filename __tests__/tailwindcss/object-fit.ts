import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Object Fit",
  expectError([
    "object-contain",
    "object-cover",
    "object-fill",
    "object-none",
    "object-scale-down",
  ])
);
