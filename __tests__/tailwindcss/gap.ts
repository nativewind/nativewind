import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

// These are half the TailwindCSS gap values due the use of margins
const scenarios: Record<string, ViewStyle["borderWidth"]> = {
  0: 0,
  px: 0.5,
  "0.5": 1,
  1: 2,
};

tailwindRunner(
  "Flexbox & Grid - Gap",
  createTests("gap", scenarios, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    marginTop: n,
    marginLeft: n,
    marginRight: n,
    marginBottom: n,
  })),
  createTests("gap-x", scenarios, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    marginLeft: n,
    marginRight: n,
  })),
  createTests("gap-y", scenarios, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    marginTop: n,
    marginBottom: n,
  }))
);
