import { ViewStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["minWidth"]> = {
  0: 0,
  full: "100%",
  "[18px]": 18,
};

tailwindRunner("Sizing - Min-Width", [
  ...createTests("min-w", scenarios, (n) => ({ minWidth: n })),
  ...expectError(["min-w-min", "min-w-max", "min-w-fit"]),
]);
