import { TextStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["letterSpacing"]> = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.25,
  wider: 0.5,
  widest: 1,
  "[0.25px]": 0.25,
};

tailwindRunner(
  "Typography - Letter Spacing",
  createTests("tracking", scenarios, (n) => ({ letterSpacing: n }))
);
