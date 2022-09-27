import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - List Style Type",
  expectError(["list-none", "list-disc", "list-decimal"])
);
