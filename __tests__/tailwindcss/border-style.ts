import { ViewStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["borderStyle"]> = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
};

tailwindRunner(
  "Borders - Border Style",

  [
    ...createTests("border", scenarios, (n) => ({
      borderStyle: n,
    })),
    ...expectError(["border-none", "border-double", "border-hidden"]),
  ]
);
