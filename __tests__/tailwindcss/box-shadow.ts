import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Effects - Box Shadow",
  expectError([
    "shadow-sm",
    "shadow",
    "shadow-md",
    "shadow-lg",
    "shadow-xl",
    "shadow-2xl",
    "shadow-inner",
    "shadow-none",
  ])
);
