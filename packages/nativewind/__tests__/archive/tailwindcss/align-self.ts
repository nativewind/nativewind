import { TextStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["alignSelf"]> = {
  auto: "auto",
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
};

tailwindRunner(
  "Layout - Align Self",
  createTests("self", scenarios, (n) => ({ alignSelf: n }))
);
