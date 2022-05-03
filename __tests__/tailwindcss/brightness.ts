import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Brightness",
  expectError([
    "brightness-0",
    "brightness-50",
    "brightness-75",
    "brightness-90",
    "brightness-95",
    "brightness-100",
    "brightness-105",
    "brightness-110",
    "brightness-125",
    "brightness-150",
    "brightness-200",
  ])
);
