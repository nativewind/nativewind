import { ViewStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["maxWidth"]> = {
  0: 0,
  full: "100%",
  "[18px]": 18,
};

tailwindRunner(
  "Sizing - Max-Width",
  createTests("max-w", scenarios, (n) => ({ maxWidth: n })),
  expectError(["max-w-max", "max-w-max", "max-w-fit"])
);
