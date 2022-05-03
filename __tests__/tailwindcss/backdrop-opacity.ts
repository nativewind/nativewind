import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Filters - Backdrop Opacity",
  expectError([
    "backdrop-opacity-0",
    "backdrop-opacity-5",
    "backdrop-opacity-10",
    "backdrop-opacity-20",
    "backdrop-opacity-25",
    "backdrop-opacity-30",
    "backdrop-opacity-40",
    "backdrop-opacity-50",
    "backdrop-opacity-60",
    "backdrop-opacity-70",
    "backdrop-opacity-75",
    "backdrop-opacity-80",
    "backdrop-opacity-90",
    "backdrop-opacity-95",
    "backdrop-opacity-100",
  ])
);
