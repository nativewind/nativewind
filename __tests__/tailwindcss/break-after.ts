import { tailwindRunner, expectError } from "./runner";

tailwindRunner("Layout - Break After", expectError([
  "break-after-auto",
  "break-after-avoid",
  "break-after-all",
  "break-after-avoid-page",
  "break-after-page",
  "break-after-left",
  "break-after-right",
  "break-after-column",
]));
