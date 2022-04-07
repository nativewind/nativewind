import { tailwindRunner, Case } from "./runner";

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

const cases: Array<Case> = [
  [
    "Layout - Columns",
    columns.map((n) => [
      n,
      {
        styles: {},
        media: {},
      },
    ]),
  ],
];

tailwindRunner(cases);
