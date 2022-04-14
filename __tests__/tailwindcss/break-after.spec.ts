import { tailwindRunner, emptyResults } from "./runner";

const breakAfter = [
  "break-after-auto",
  "break-after-avoid",
  "break-after-all",
  "break-after-avoid-page",
  "break-after-page",
  "break-after-left",
  "break-after-right",
  "break-after-column",
];

tailwindRunner("Layout - Break After", emptyResults(breakAfter));
