import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Blur",
  expectError([
    "blur-none",
    "blur-sm",
    "blur",
    "blur-md",
    "blur-lg",
    "blur-xl",
    "blur-2xl",
    "blur-3xl",
  ])
);
