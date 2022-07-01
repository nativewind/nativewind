import { Dimensions } from "react-native";

export default function vh(value: string | number) {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Dimensions.get("window").height * (parsed / 100);
}
