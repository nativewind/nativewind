import { TextStyle } from "react-native";
import { generateTestsForScales, tailwindRunner } from "./runner";

const options: Record<string, TextStyle["alignSelf"]> = {
  auto: "auto",
  start: "flex-start",
  end: "flex-end",
  center: "center",
  stretch: "stretch",
  baseline: "baseline",
};

tailwindRunner(
  "Layout - Align Self",
  generateTestsForScales("self", Object.keys(options), (n) => ({
    alignSelf: options[n],
  }))
);
