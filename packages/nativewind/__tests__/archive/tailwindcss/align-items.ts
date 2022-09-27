import { TextStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["alignItems"]> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  baseline: "baseline",
  stretch: "stretch",
};

tailwindRunner(
  "Layout - Align Items",
  createTests("items", scenarios, (n) => ({ alignItems: n }))
);
