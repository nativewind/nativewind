import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Size",
  expectError(["bg-auto", "bg-cover", "bg-contain"])
);
