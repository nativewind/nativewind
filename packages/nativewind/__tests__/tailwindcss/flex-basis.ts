import { ViewStyle } from "react-native";
import { tailwindRunner, expectError, createTests } from "./runner";

const scenarios: Record<string, ViewStyle["flexBasis"]> = {
  0: 0,
  1: 4,
  px: 1,
  "0.5": 2,
  "1.5": 6,
  "1/2": "50%",
  "2/3": "66.666667%",
  full: "100%",
  "[999%]": "999%",
};

tailwindRunner(
  "Layout - Flex Basis",
  createTests("basis", scenarios, (n) => ({ flexBasis: n })),
  expectError(["basis-auto"])
);
