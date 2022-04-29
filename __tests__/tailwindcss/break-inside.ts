import { tailwindRunner, expectError } from "./runner";

tailwindRunner("Layout - Break Inside", expectError([
  "break-inside-auto",
  "break-inside-avoid",
  "break-inside-avoid-page",
  "break-inside-avoid-column",
]));
