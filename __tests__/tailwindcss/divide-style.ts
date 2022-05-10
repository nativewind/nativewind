import { ViewStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["borderStyle"]> = {
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
};

tailwindRunner("Border - Divide Style", [
  ...createTests("divide", scenarios, (n) => ({
    media: ["--general-sibling-combinator"],
    style: {
      borderStyle: n,
    },
  })),
  ...expectError(["divide-double", "divide-none"]),
]);
