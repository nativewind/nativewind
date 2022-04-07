import { tailwindRunner, Case } from "./runner";

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

const cases: Array<Case> = [
  [
    "Layout - Break Before",
    breakBefore.map((n) => [
      n,
      {
        styles: {},
        media: {},
      },
    ]),
  ],
];

tailwindRunner(cases);
