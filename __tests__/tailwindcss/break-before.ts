import { tailwindRunner, expectError } from "./runner";

tailwindRunner("Layout - Break Before", expectError([
  "break-before-auto",
  "break-before-avoid",
  "break-before-all",
  "break-before-avoid-page",
  "break-before-page",
  "break-before-left",
  "break-before-right",
  "break-before-column",
]));
