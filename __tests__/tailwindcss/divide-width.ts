import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["borderWidth"]> = {
  0: 0,
  2: 2,
  4: 4,
  8: 8,
};

tailwindRunner(
  "Border - Divide Width",
  createTests("divide-x", scenarios, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    borderLeftWidth: n,
    borderRightWidth: n,
  })),
  createTests("divide-y", scenarios, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    borderTopWidth: n,
    borderBottomWidth: n,
  }))
);
