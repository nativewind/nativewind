import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Effects - Box Shadow",
  [
    [
      "shadow-sm",
      {
        styles: {
          "shadow-sm": {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 1.5,
          },
        },
      },
    ],
    [
      "shadow",
      {
        styles: {
          shadow: {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 3,
          },
        },
      },
    ],
    [
      "shadow-md",
      {
        styles: {
          "shadow-md": {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { height: 6, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
            elevation: 6,
          },
        },
      },
    ],
    [
      "shadow-lg",
      {
        styles: {
          "shadow-lg": {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { height: 10, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 7.5,
          },
        },
      },
    ],
    [
      "shadow-xl",
      {
        styles: {
          "shadow-xl": {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { height: 20, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 25,
            elevation: 12.5,
          },
        },
      },
    ],
    [
      "shadow-2xl",
      {
        styles: {
          "shadow-2xl": {
            shadowColor: "rgba(0, 0, 0, 0.1)",
            shadowOffset: { height: 25, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 50,
            elevation: 25,
          },
        },
      },
    ],
    [
      "shadow-none",
      {
        styles: {
          "shadow-none": {
            shadowColor: "rgba(0, 0, 0, 0)",
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          },
        },
      },
    ],
  ],
  expectError(["shadow-inner"])
);
