import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["borderWidth"]> = {
  0: 0,
  2: 2,
  4: 4,
  8: 8,
};

tailwindRunner("Border - Divide Width", [
  ...createTests("divide-x", scenarios, (n) => ({
    media: ["--general-sibling-combinator"],
    style: {
      borderLeftWidth: n,
      borderRightWidth: n,
    },
  })),
  ...createTests("divide-y", scenarios, (n) => ({
    media: ["--general-sibling-combinator"],
    style: {
      borderTopWidth: n,
      borderBottomWidth: n,
    },
  })),
]);
