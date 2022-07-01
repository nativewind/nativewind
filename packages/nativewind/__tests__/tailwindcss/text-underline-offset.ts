import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Text Underline Offset",
  expectError([
    "underline-offset-auto",
    "underline-offset-0",
    "underline-offset-1",
    "underline-offset-2",
    "underline-offset-4",
    "underline-offset-8",
  ])
);
