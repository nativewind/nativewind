import { tailwindRunner, Case } from "./runner";

const breakInside = [
  "break-inside-auto",
  "break-inside-avoid",
  "break-inside-avoid-page",
  "break-inside-avoid-column",
];

const cases: Array<Case> = [
  [
    "Layout - Break Inside",
    breakInside.map((n) => [
      n,
      {
        styles: {},
        media: {},
      },
    ]),
  ],
];

tailwindRunner(cases);
