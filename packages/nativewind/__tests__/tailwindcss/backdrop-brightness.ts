import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Brightness",
  expectError([
    "backdrop-brightness-0",
    "backdrop-brightness-50",
    "backdrop-brightness-75",
    "backdrop-brightness-90",
    "backdrop-brightness-95",
    "backdrop-brightness-100",
    "backdrop-brightness-105",
    "backdrop-brightness-110",
    "backdrop-brightness-125",
    "backdrop-brightness-150",
    "backdrop-brightness-200",
  ])
);
