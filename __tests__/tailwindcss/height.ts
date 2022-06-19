import { ViewStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["height"]> = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  96: 384,
  "1/2": "50%",
  "1/3": "33.333333%",
  full: "100%",
  "[18px]": 18,
};

tailwindRunner(
  "Sizing - Height",
  createTests("h", scenarios, (n) => ({ height: n })),
  expectError(["h-auto", "h-min", "h-max", "h-fit"]),
  [
    [
      "h-screen",
      {
        styles: {
          "h-screen@0": {
            height: 100,
          },
        },
        topics: {
          "h-screen": ["height"],
        },
        atRules: {
          "h-screen": [[["dynamic-style", "vh"]]],
        },
      },
    ],
  ]
);
