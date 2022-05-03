import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Brightness",
  expectError([
    "backdrop-contrast-0",
    "backdrop-contrast-50",
    "backdrop-contrast-75",
    "backdrop-contrast-100",
    "backdrop-contrast-125",
    "backdrop-contrast-150",
    "backdrop-contrast-200",
  ])
);
