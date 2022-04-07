import { tailwindRunner, Case } from "./runner";

const classes = ["box-decoration-clone", "box-decoration-break"];

const cases: Array<Case> = [
  [
    "Layout - Box Decoration Break",
    classes.map((n) => [
      n,
      {
        styles: {},
        media: {},
      },
    ]),
  ],
];

tailwindRunner(cases);
