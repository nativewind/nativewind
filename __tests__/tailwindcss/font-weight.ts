import { TextStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["fontWeight"]> = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

tailwindRunner("Typography - Font Weight", [
  ...createTests("font", scenarios, (n) => ({ fontWeight: n })),
]);
