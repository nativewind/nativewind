import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Backgrounds - Background Image",
  expectError([
    "bg-none",
    "bg-gradient-to-t",
    "bg-gradient-to-tr",
    "bg-gradient-to-r",
    "bg-gradient-to-br",
    "bg-gradient-to-b",
    "bg-gradient-to-bl",
    "bg-gradient-to-l",
    "bg-gradient-to-tl",
  ])
);
