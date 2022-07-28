import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Effects - Box Shadow",
  [
    [
      "shadow-sm",
      {
        styles: {
          "shadow-sm@0": {
            elevation: 1.5,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow-sm@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
          "shadow-sm@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 1, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 2,
          },
        },
        atRules: {
          "shadow-sm": [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
    [
      "shadow",
      {
        styles: {
          "shadow@0": {
            elevation: 3,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
          },
          "shadow@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
          },
        },
        atRules: {
          shadow: [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
    [
      "shadow-md",
      {
        styles: {
          "shadow-md@0": {
            elevation: 6,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow-md@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 6, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
          },
          "shadow-md@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 6, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 10,
          },
        },
        atRules: {
          "shadow-md": [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
    [
      "shadow-lg",
      {
        styles: {
          "shadow-lg@0": {
            elevation: 7.5,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow-lg@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 10, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 15,
          },
          "shadow-lg@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 10, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 15,
          },
        },
        atRules: {
          "shadow-lg": [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
    [
      "shadow-xl",
      {
        styles: {
          "shadow-xl@0": {
            elevation: 12.5,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow-xl@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 20, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 25,
          },
          "shadow-xl@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 20, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 25,
          },
        },
        atRules: {
          "shadow-xl": [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
    [
      "shadow-2xl",
      {
        styles: {
          "shadow-2xl@0": {
            elevation: 25,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow-2xl@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 25, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 50,
          },
          "shadow-2xl@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 25, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 50,
          },
        },
        atRules: {
          "shadow-2xl": [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
    [
      "shadow-none",
      {
        styles: {
          "shadow-none@0": {
            elevation: 0,
            shadowColor: "rgba(0, 0, 0, 1)",
          },
          "shadow-none@1": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 0,
          },
          "shadow-none@2": {
            shadowColor: "rgba(0, 0, 0, 1)",
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 1,
            shadowRadius: 0,
          },
        },
        atRules: {
          "shadow-none": [
            [["media", "android"]],
            [["media", "ios"]],
            [["media", "web"]],
          ],
        },
      },
    ],
  ],
  expectError(["shadow-inner"])
);
