import { TextStyle } from "react-native";
import { generateTestsForScales, tailwindRunner } from "./runner";

const options: Record<string, TextStyle["alignContent"]> = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
  // evenly: "stretch", // Should error
};

tailwindRunner(
  "Layout - Align Content",
  generateTestsForScales("content", Object.keys(options), (n) => ({
    alignContent: options[n],
  }))
);
