import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Scale",
  [
    [
      "translate-x-0",
      {
        "translate-x-0": [
          { transform: [{ translateY: 0 }, { translateX: 0 }] },
        ],
      },
    ],
    [
      "translate-y-0",
      {
        "translate-y-0": [
          {
            transform: [{ translateY: 0 }, { translateX: 0 }],
          },
        ],
      },
    ],
    [
      "translate-x-px",
      {
        "translate-x-px": [
          {
            transform: [{ translateY: 0 }, { translateX: 1 }],
          },
        ],
      },
    ],
    [
      "translate-y-px",
      {
        "translate-y-px": [
          {
            transform: [{ translateY: 1 }, { translateX: 0 }],
          },
        ],
      },
    ],
    [
      "translate-x-1",
      {
        "translate-x-1": [
          {
            transform: [{ translateY: 0 }, { translateX: 4 }],
          },
        ],
      },
    ],
    [
      "translate-y-1",
      {
        "translate-y-1": [
          {
            transform: [{ translateY: 4 }, { translateX: 0 }],
          },
        ],
      },
    ],
  ],
  expectError([
    "translate-x-1/3",
    "translate-y-1/3",
    "translate-x-full",
    "translate-y-full",
  ])
);
