import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - List Style Position",
  expectError(["list-inside", "list-outside"])
);
