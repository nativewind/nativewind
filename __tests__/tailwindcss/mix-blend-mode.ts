import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Effects - Mix Blend Mode",
  expectError([
    "mix-blend-normal",
    "mix-blend-multiply",
    "mix-blend-screen",
    "mix-blend-overlay",
    "mix-blend-darken",
    "mix-blend-lighten",
    "mix-blend-color-dodge",
    "mix-blend-color-burn",
    "mix-blend-hard-light",
    "mix-blend-soft-light",
    "mix-blend-difference",
    "mix-blend-exclusion",
    "mix-blend-hue",
    "mix-blend-saturation",
    "mix-blend-color",
    "mix-blend-luminosity",
  ])
);
