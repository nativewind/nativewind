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
            borderBottomWidth: "styleSheet(hairlineWidth)",
            borderTopWidth: "styleSheet(hairlineWidth)",
            borderLeftWidth: "styleSheet(hairlineWidth)",
            borderRightWidth: "styleSheet(hairlineWidth)",
          } as Style,
        ],
      },
    ],
    [
      "border-x",
      {
        "border-x": [
          {
            borderLeftWidth: "styleSheet(hairlineWidth)",
            borderRightWidth: "styleSheet(hairlineWidth)",
          } as Style,
        ],
      },
    ],
    [
      "border-y",
      {
        "border-y": [
          {
            borderTopWidth: "styleSheet(hairlineWidth)",
            borderBottomWidth: "styleSheet(hairlineWidth)",
          } as Style,
        ],
      },
    ],
    [
      "border-t",
      {
        "border-t": [{ borderTopWidth: "styleSheet(hairlineWidth)" } as Style],
      },
    ],
    [
      "border-b",
      {
        "border-b": [
          { borderBottomWidth: "styleSheet(hairlineWidth)" } as Style,
        ],
      },
    ],
    [
      "border-l",
      {
        "border-l": [{ borderLeftWidth: "styleSheet(hairlineWidth)" } as Style],
      },
    ],
    [
      "border-r",
      {
        "border-r": [
          { borderRightWidth: "styleSheet(hairlineWidth)" } as Style,
        ],
      },
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
