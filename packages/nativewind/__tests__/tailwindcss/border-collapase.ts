import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Tables - Border Collapse",
  expectError(["border-collapse", "border-separate"])
);
