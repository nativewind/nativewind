import { tailwindRunner, Case } from "./runner";

const cases: Array<Case> = [
  [
    "Layout - Container",
    [
      [
        "container",
        {
          styles: {
            container: { width: "100%" },
            container1: { maxWidth: 640 },
            container2: { maxWidth: 768 },
            container3: { maxWidth: 1024 },
            container4: { maxWidth: 1280 },
            container5: { maxWidth: 1536 },
          },
          media: {
            container: [
              { media: ["(min-width: 640px)"], suffix: 1 },
              { media: ["(min-width: 768px)"], suffix: 2 },
              { media: ["(min-width: 1024px)"], suffix: 3 },
              { media: ["(min-width: 1280px)"], suffix: 4 },
              { media: ["(min-width: 1536px)"], suffix: 5 },
            ],
          },
        },
      ],
      [
        "sm:container",
        {
          styles: {
            "sm\\:container0": { width: "100%" },
            "sm\\:container1": { maxWidth: 640 },
            "sm\\:container2": { maxWidth: 768 },
            "sm\\:container3": { maxWidth: 1024 },
            "sm\\:container4": { maxWidth: 1280 },
            "sm\\:container5": { maxWidth: 1536 },
          },
          media: {
            "sm\\:container": [
              { media: ["(min-width: 640px)"], suffix: 0 },
              { media: ["(min-width: 640px)"], suffix: 1 },
              {
                media: ["(min-width: 640px)", "(min-width: 768px)"],
                suffix: 2,
              },
              {
                media: ["(min-width: 640px)", "(min-width: 1024px)"],
                suffix: 3,
              },
              {
                media: ["(min-width: 640px)", "(min-width: 1280px)"],
                suffix: 4,
              },
              {
                media: ["(min-width: 640px)", "(min-width: 1536px)"],
                suffix: 5,
              },
            ],
          },
        },
      ],
    ],
  ],
];

tailwindRunner(cases);
