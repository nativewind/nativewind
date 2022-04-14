import { tailwindRunner, emptyResults } from "./runner";

const columns = [
  "columns-1",
  "columns-2",
  "columns-3",
  "columns-4",
  "columns-5",
  "columns-6",
  "columns-7",
  "columns-8",
  "columns-[10rem]",
];

tailwindRunner("Layout - Columns", emptyResults(columns));
