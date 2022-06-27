import { Dimensions } from "react-native";

export default function vw(value: string | number) {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Dimensions.get("window").width * (parsed / 100);
}
