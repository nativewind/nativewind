import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Whitespace",
  expectError([
    "whitespace-normal",
    "whitespace-nowrap",
    "whitespace-pre",
    "whitespace-pre-line",
    "whitespace-pre-wrap",
  ])
);
