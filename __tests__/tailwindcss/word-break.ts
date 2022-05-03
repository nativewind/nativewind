import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Work Break",
  expectError(["break-normal", "break-words", "break-all"])
);
