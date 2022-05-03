import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Blur",
  expectError([
    "backdrop-blur-none",
    "backdrop-blur-sm",
    "backdrop-blur",
    "backdrop-blur-md",
    "backdrop-blur-lg",
    "backdrop-blur-xl",
    "backdrop-blur-2xl",
    "backdrop-blur-3xl",
  ])
);
