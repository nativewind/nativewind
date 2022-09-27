import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Tables - Table Layout",
  expectError(["table-auto", "table-fixed"])
);
