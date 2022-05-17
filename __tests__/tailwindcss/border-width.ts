import { Style } from "css-to-react-native";
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
            borderBottomWidth: "hairlineWidth",
            borderTopWidth: "hairlineWidth",
            borderLeftWidth: "hairlineWidth",
            borderRightWidth: "hairlineWidth",
          } as Style,
        ],
      },
    ],
    [
      "border-x",
      {
        "border-x": [
          {
            borderLeftWidth: "hairlineWidth",
            borderRightWidth: "hairlineWidth",
          } as Style,
        ],
      },
    ],
    [
      "border-y",
      {
        "border-y": [
          {
            borderTopWidth: "hairlineWidth",
            borderBottomWidth: "hairlineWidth",
          } as Style,
        ],
      },
    ],
    [
      "border-t",
      { "border-t": [{ borderTopWidth: "hairlineWidth" } as Style] },
    ],
    [
      "border-b",
      { "border-b": [{ borderBottomWidth: "hairlineWidth" } as Style] },
    ],
    [
      "border-l",
      { "border-l": [{ borderLeftWidth: "hairlineWidth" } as Style] },
    ],
    [
      "border-r",
      { "border-r": [{ borderRightWidth: "hairlineWidth" } as Style] },
    ],
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
);
