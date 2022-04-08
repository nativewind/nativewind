import { tailwindRunner, Case } from "./runner";

const cases: Array<Case> = [
  [
    "Layout - Margin",
    [
      [
        "my-8",
        {
          styles: {
            "my-8": { marginBottom: 32, marginTop: 32 },
          },
          media: {},
        },
      ],
    ],
  ],
];

tailwindRunner(cases);
