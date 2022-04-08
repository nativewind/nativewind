import { tailwindRunner, Case } from "./runner";

const cases: Array<Case> = [
  [
    "Typography - Letter Spacing",
    [
      [
        "tracking-wide",
        {
          styles: {
            "tracking-wide": { letterSpacing: 0.25 },
          },
          media: {},
        },
      ],
    ],
  ],
];

tailwindRunner(cases);
