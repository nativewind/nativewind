import { ViewStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["width"]> = {
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
  "Sizing - Width",
  createTests("w", scenarios, (n) => ({ width: n })),
  expectError(["w-auto", "w-min", "w-max", "w-fit"]),
  [
    [
      "w-screen",
      {
        styles: {
          "w-screen@0": {
            width: 100,
          },
        },
        topics: {
          "w-screen": ["width"],
        },
        atRules: {
          "w-screen": [[["dynamic-style", "vw"]]],
        },
      },
    ],
  ]
);
