import { tailwindRunner, expectError } from "./runner";

tailwindRunner(
  "Layout - Translate",
  [
    [
      "translate-x-0",
      {
        styles: {
          "translate-x-0": {
            transform: [{ translateY: 0 }, { translateX: 0 }],
          },
        },
        transforms: {
          "translate-x-0": true,
        },
      },
    ],
    [
      "translate-y-0",
      {
        styles: {
          "translate-y-0": {
            transform: [{ translateY: 0 }, { translateX: 0 }],
          },
        },
        transforms: {
          "translate-y-0": true,
        },
      },
    ],
    [
      "translate-x-px",
      {
        styles: {
          "translate-x-px": {
            transform: [{ translateY: 0 }, { translateX: 1 }],
          },
        },
        transforms: {
          "translate-x-px": true,
        },
      },
    ],
    [
      "translate-y-px",
      {
        styles: {
          "translate-y-px": {
            transform: [{ translateY: 1 }, { translateX: 0 }],
          },
        },
        transforms: {
          "translate-y-px": true,
        },
      },
    ],
    [
      "translate-x-1",
      {
        styles: {
          "translate-x-1": {
            transform: [{ translateY: 0 }, { translateX: 4 }],
          },
        },
        transforms: {
          "translate-x-1": true,
        },
      },
    ],
    [
      "translate-y-1",
      {
        styles: {
          "translate-y-1": {
            transform: [{ translateY: 4 }, { translateX: 0 }],
          },
        },
        transforms: {
          "translate-y-1": true,
        },
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
