import { TextStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["textAlign"]> = {
  left: "left",
  center: "center",
  right: "right",
  justify: "justify",
};

tailwindRunner(
  "Typography - Text Align",
  createTests("text", scenarios, (n) => ({ textAlign: n }))
);
