import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Attachment",
  expectError(["bg-fixed", "bg-local", "bg-scroll"])
);
