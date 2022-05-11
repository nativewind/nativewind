import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["borderWidth"]> = {
  0: 0,
  2: 2,
  4: 4,
  8: 8,
};

tailwindRunner(
  "Border - Border Width",
  [
    [
      "border",
      {
        border: [
          {
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
          },
        ],
      },
    ],
    ["border-x", { "border-x": [{ borderLeftWidth: 1, borderRightWidth: 1 }] }],
    ["border-y", { "border-y": [{ borderTopWidth: 1, borderBottomWidth: 1 }] }],
    ["border-t", { "border-t": [{ borderTopWidth: 1 }] }],
    ["border-b", { "border-b": [{ borderBottomWidth: 1 }] }],
    ["border-l", { "border-l": [{ borderLeftWidth: 1 }] }],
    ["border-r", { "border-r": [{ borderRightWidth: 1 }] }],
  ],
  createTests("border", scenarios, (n) => ({
    borderBottomWidth: n,
    borderRightWidth: n,
    borderTopWidth: n,
    borderLeftWidth: n,
  })),
  createTests("border-x", scenarios, (n) => ({
    borderRightWidth: n,
    borderLeftWidth: n,
  })),
  createTests("border-y", scenarios, (n) => ({
    borderBottomWidth: n,
    borderTopWidth: n,
  })),
  createTests("border-t", scenarios, (n) => ({
    borderTopWidth: n,
  })),
  createTests("border-b", scenarios, (n) => ({
    borderBottomWidth: n,
  })),
  createTests("border-l", scenarios, (n) => ({
    borderLeftWidth: n,
  })),
  createTests("border-r", scenarios, (n) => ({
    borderRightWidth: n,
  }))
  // ...createTests("border-bl", scenarios, (n) => ({
  //   borderBottomWidth: n,
  // })),
);
