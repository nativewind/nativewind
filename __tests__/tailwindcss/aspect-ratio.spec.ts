import { tailwindRunner, Case } from "./runner";

const cases: Array<Case> = [
  [
    "Layout - Container",
    [
      [
        "aspect-auto",
        {
          styles: {
            "aspect-auto": { aspectRatio: undefined },
          },
          media: {},
        },
      ],

      [
        "aspect-square",
        {
          styles: {
            "aspect-square": { aspectRatio: 1 },
          },
          media: {},
        },
      ],
      [
        "aspect-video",
        {
          styles: {
            "aspect-video": { aspectRatio: 1.7777777777777777 },
          },
          media: {},
        },
      ],
      [
        "aspect-[4/3]",
        {
          styles: {
            "aspect-\\[4\\/3\\]": { aspectRatio: 1.3333333333333333 },
          },
          media: {},
        },
      ],
    ],
  ],
];

tailwindRunner(cases);
