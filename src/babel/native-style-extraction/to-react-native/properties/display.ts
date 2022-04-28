import { Style } from "css-to-react-native";

export function display(value: string): Style {
  if (value !== "none" && value !== "flex") {
    throw new Error("display");
  }

  return { display: value };
}
