import { tailwindRunner, Case } from "./runner";

const cases: Array<Case> = [
  [
    "Layout - Box Sizing",
    [
      [
        "box-border",
        {
          styles: {},
          media: {},
        },
      ],
      [
        "box-content",
        {
          styles: {},
          media: {},
        },
      ],
    ],
  ],
];

tailwindRunner(cases);
