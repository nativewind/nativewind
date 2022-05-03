import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Typography - Font Smoothing",
  expectError(["antialiased", "subpixel-antialiased"])
);
