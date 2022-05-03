import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Effects - Background Blend Mode",
  expectError([
    "bg-blend-normal",
    "bg-blend-multiply",
    "bg-blend-screen",
    "bg-blend-overlay",
    "bg-blend-darken",
    "bg-blend-lighten",
    "bg-blend-color-dodge",
    "bg-blend-color-burn",
    "bg-blend-hard-light",
    "bg-blend-soft-light",
    "bg-blend-difference",
    "bg-blend-exclusion",
    "bg-blend-hue",
    "bg-blend-saturation",
    "bg-blend-color",
    "bg-blend-luminosity",
  ])
);
