import { ViewStyle } from "react-native";
import { tailwindRunner, expectError, createTests } from "./runner";

const scenarios: Record<string, ViewStyle["zIndex"]> = {
  0: 0,
  10: 10,
  "[100]": 100,
};

tailwindRunner("Layout - Z-Index", [
  ...expectError(["z-auto"]),
  ...createTests("z", scenarios, (n) => ({ zIndex: n })),
]);
