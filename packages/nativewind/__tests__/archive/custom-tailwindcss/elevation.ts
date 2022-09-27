import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "../tailwindcss/runner";

const scenarios: Record<string, ViewStyle["elevation"]> = {
  sm: 1.5,
  "": 3,
  lg: 7.5,
  xl: 12.5,
  "2xl": 25,
  none: 0,
};

tailwindRunner(
  "Custom - Elevation",
  createTests("elevation", scenarios, (n) => ({ elevation: n }))
);
