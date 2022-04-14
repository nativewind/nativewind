import { tailwindRunner, emptyResults } from "./runner";

const breakInside = [
  "break-inside-auto",
  "break-inside-avoid",
  "break-inside-avoid-page",
  "break-inside-avoid-column",
];

tailwindRunner("Layout - Break Inside", emptyResults(breakInside));
