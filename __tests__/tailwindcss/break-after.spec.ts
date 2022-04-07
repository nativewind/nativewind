import { tailwindRunner, Case } from "./runner";

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

const cases: Array<Case> = [
  [
    "Layout - Break After",
    breakAfter.map((n) => [
      n,
      {
        styles: {},
        media: {},
      },
    ]),
  ],
];

tailwindRunner(cases);
