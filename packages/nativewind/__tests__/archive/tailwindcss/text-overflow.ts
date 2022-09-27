import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Text Overflow",
  // "truncate", should error
  expectError(["text-ellipsis", "text-clip"])
);
