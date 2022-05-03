import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Text Decoration Thickness",
  expectError([
    "decoration-auto",
    "decoration-from-font",
    "decoration-0",
    "decoration-1",
    "decoration-2",
    "decoration-4",
    "decoration-8",
  ])
);
