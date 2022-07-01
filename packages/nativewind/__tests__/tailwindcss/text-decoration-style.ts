import { TextStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["textDecorationStyle"]> = {
  solid: "solid",
  double: "double",
  dotted: "dotted",
  dashed: "dashed",
};

tailwindRunner(
  "Typography - Text Decoration Style",
  createTests("decoration", scenarios, (n) => ({ textDecorationStyle: n })),
  expectError(["decoration-wavy"])
);
