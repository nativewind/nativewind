import { tailwindRunner, emptyResults } from "./runner";

const breakBefore = [
  "break-before-auto",
  "break-before-avoid",
  "break-before-all",
  "break-before-avoid-page",
  "break-before-page",
  "break-before-left",
  "break-before-right",
  "break-before-column",
];

tailwindRunner("Layout - Break Before", emptyResults(breakBefore));
