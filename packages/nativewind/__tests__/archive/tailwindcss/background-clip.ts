import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Clip",
  expectError([
    "bg-clip-border",
    "bg-clip-padding",
    "bg-clip-content",
    "bg-clip-text",
  ])
);
