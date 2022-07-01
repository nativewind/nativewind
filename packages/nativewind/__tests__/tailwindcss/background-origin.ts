import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Origin",
  expectError(["bg-origin-border", "bg-origin-padding", "bg-origin-content"])
);
